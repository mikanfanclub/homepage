//https://docs.google.com/spreadsheets/d/18TiiB6T8RIK0w4xrXWO7v_pQJeVhmuzOqYELstQDZ1k/edit?usp=sharing

// 【要変更】Google SpreadsheetのIDに置き換えてください
const SPREADSHEET_ID = '18TiiB6T8RIK0w4xrXWO7v_pQJeVhmuzOqYELstQDZ1k';

// 【要変更】シートのGID（通常は0、URLの#gid=XXの部分）に置き換えてください
const SHEET_GID = '0';

// Google Visualization APIのURLを構築
const API_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?gid=${SHEET_GID}&tqx=out:json`;




/**
 * 限定的なMarkdown記法をHTMLに変換する関数
 * @param {string} markdownText - Markdown形式のテキスト
 * @returns {string} HTML形式のテキスト
 */
function markdownToHtml(markdownText, variable) {
  if (!markdownText) return '';

  let html = markdownText;
  let varIndex = 0; // 変数配列のインデックス

  // 1. **太字** または __太字__ を <strong>タグに変換
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

  // 2. *斜体* または _斜体_ を <em>タグに変換
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');

  // 3. 2つ以上のスペース＋改行、または単純な改行を <br> タグに変換
  html = html.replace(/ {2,}\n/g, '<br>'); // 行末スペース2つ以上
  html = html.replace(/\n/g, '<br>');      // 単純な改行（これは好みに応じて削除しても良い）

  // 4. +オレンジ文字+
  html = html.replace(/\+(.*?)\+/g, '<span style="color:#f69749;">$1</span>');


  // 5. リンク（プレースホルダ形式）
  // replaceの第2引数に、マッチするたびに実行される関数を渡します
  html = html.replace(/\^(.*?)\^/g, (match, p1) => {
    const url = variable[varIndex] ? variable[varIndex].trim() : '#';
    varIndex++; // 次のリンクへ
    return `<a href="${url}">${p1}</a>`;


  }); return html;
}

/**
 * Google Sheetsのデータを取得し、HTMLに表示する関数
 */
export async function fetchAndDisplayActivities(listElement, start_row = 0, max_rows = 5, mode = 'replace') {
  if (mode === 'replace') {
    listElement.innerHTML = '<li>データを取得中です...</li>'; // ロード中のメッセージ更新
  } else if (mode === 'append') {
    listElement.innerHTML += '<li class="activities-list-foot-message">データを取得中です...</li>'; // ロード中のメッセージ更新
  }

  try {
    const response = await fetch(API_URL);
    const text = await response.text();

    // JSONP Paddingの除去
    const jsonText = text
      .replace(/^\s*\/\*.*?\*\/\s*google\.visualization\.Query\.setResponse\s*\(/, '')
      .replace(/\);\s*$/, '');

    const data = JSON.parse(jsonText);
    const rows = data.table.rows;

    if (!rows || rows.length <= 1) { // ヘッダー行のみの場合も考慮
      if (mode === 'replace') {
        listElement.innerHTML = '<li>活動データがありません。</li>';
      } else if (mode === 'append') {
        listElement.innerHTML += '<li class="activities-list-foot-message">活動は以上です(2025/11月以降)</li>';
      }
      return;
    }

    // 最新の5行を取得し、逆順にする（最新が上）
    const recentRows = rows.slice(1).reverse().slice(start_row, start_row + max_rows);

    const htmlPromises = recentRows.map(async (row) => {
      // データ取得
      const title = row.c[0] && row.c[0].v !== null ? row.c[0].v : 'タイトルなし';
      const date = row.c[1] && row.c[1].f ? row.c[1].f : '日付なし';
      const description = row.c[2] && row.c[2].v !== null ? row.c[2].v : '説明なし';
      let photofile = row.c[3] && row.c[3].v !== null ? row.c[3].v : 'no-image.webp';
      let raw_variable = row.c[4] && row.c[4].v !== null ? row.c[4].v : '';
      let variable = raw_variable.split(',').map(v => v.trim());
      let raw_tag = row.c[5] && row.c[5].v !== null ? row.c[5].v : 'その他';
      let tag = raw_tag.split(',');

      let taghtml = tag.map((t) => {
        let tagBcColor = '#838383'; //デフォルト灰色
        switch (t) {
          case '交流':
            tagBcColor = '#4473b7';//青
            break;
          case '企画':
            tagBcColor = '#57b774';//緑
            break;
          case '産地訪問':
            tagBcColor = '#ffb42b';//黄色
            break;
          case '柑橘会':
            tagBcColor = '#c65b30';//オレンジ
            break;
          case '学園祭':
            tagBcColor = '#ff5144';//赤
            break;
        }
        return `<span class="small-info-tag" style="background-color:${tagBcColor};margin-right:5px;">${t}</span>`;
      }).join('');

      const imagePath = `img/recent/${photofile}`;

      const htmlDescription = markdownToHtml(description, variable);
      // HTML文字列を返す
      return `
                <div class="row reveal small-info">
                    <div class="coming-photo">
                        <img
                          src="/img/recent/${photofile}"
                          alt
                          onerror="this.onerror = null; this.src='img/recent/no-image.webp';"
                        />
                    </div>
                    <div class="col-sm-8" style="font-size: 18px">
                        ${taghtml}
                        <div style="padding-top:5px;padding-bottom:5px;">
                          <h2 class="small-info-title"> ${title} </h2>
                          <span class="small-info-date">${date}</span>
                        </div>
                        <span class="small-info-inner">
                        <p>${htmlDescription}
                        </p>
                        </span>
                    </div> 
                </div>`;
    });

    // ⭐ Promise.all で全ての画像確認（とHTML生成）が完了するのを待つ
    const htmlContents = await Promise.all(htmlPromises);

    // リスト要素をクリア
    if (mode === 'replace') { listElement.innerHTML = ''; }
    else if (mode === 'append') {
      // 末尾の「データを取得中です...」メッセージを削除
      const loadingMessage = listElement.querySelector('.activities-list-foot-message');
      if (loadingMessage) {
        listElement.removeChild(loadingMessage);
      }
    }

    // 全てのHTMLをDOMに追加
    htmlContents.forEach(html => {
      const listItem = document.createElement('li');
      listItem.innerHTML = html;
      listElement.appendChild(listItem);
    });

    if (rows.length - 1 > max_rows + start_row) { return true; } else { return false; }

  } catch (error) {
    console.error('データの取得中にエラーが発生しました:', error);
    listElement.innerHTML = `<li>データの読み込みに失敗しました。詳細: ${error.message}</li>`;
  }
}


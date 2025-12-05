//https://docs.google.com/spreadsheets/d/18TiiB6T8RIK0w4xrXWO7v_pQJeVhmuzOqYELstQDZ1k/edit?usp=sharing

// 【要変更】Google SpreadsheetのIDに置き換えてください
const SPREADSHEET_ID = '18TiiB6T8RIK0w4xrXWO7v_pQJeVhmuzOqYELstQDZ1k';

// 【要変更】シートのGID（通常は0、URLの#gid=XXの部分）に置き換えてください
const SHEET_GID = '0';

// Google Visualization APIのURLを構築
const API_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?gid=${SHEET_GID}&tqx=out:json`;

// 表示する行数（最後から数える）
const MAX_ROWS = 5;

// HTMLの要素
const listElement = document.getElementById('activities-list');

// --- checkImage 関数はそのまま利用 ---
function checkImage(src) {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.onload = () => resolve(true); // 読み込み成功
    img.onerror = () => resolve(false); // 読み込み失敗（404など）
    img.src = src;
  });
}


/**
 * 限定的なMarkdown記法をHTMLに変換する関数
 * @param {string} markdownText - Markdown形式のテキスト
 * @returns {string} HTML形式のテキスト
 */
function markdownToHtml(markdownText, variable) {
  if (!markdownText) return '';

  let html = markdownText;

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


  // 4. ^リンク^
  html = html.replace(/\^(.*?)\^/g, `<a href=${variable}>$1</a>`);

  return html;
}

/**
 * Google Sheetsのデータを取得し、HTMLに表示する関数
 */
async function fetchAndDisplayActivities() {
  listElement.innerHTML = '<li>データを取得中です...</li>'; // ロード中のメッセージ更新

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
      listElement.innerHTML = '<li>活動データがありません。</li>';
      return;
    }

    // 最新の5行を取得し、逆順にする（最新が上）
    const recentRows = rows.slice(1).slice(-MAX_ROWS).reverse();

    const htmlPromises = recentRows.map(async (row) => {
      // データ取得
      const title = row.c[0] && row.c[0].v !== null ? row.c[0].v : 'タイトルなし';
      const date = row.c[1] && row.c[1].f ? row.c[1].f : '日付なし';
      const description = row.c[2] && row.c[2].v !== null ? row.c[2].v : '説明なし';
      let photofile = row.c[3] && row.c[3].v !== null ? row.c[3].v : 'no-image.webp';
      let variable = row.c[4] && row.c[4].v !== null ? row.c[4].v : '';
      let tag = row.c[5] && row.c[5].v !== null ? row.c[5].v : 'その他';
      let tagBcColor = '#838383';

      switch (tag) {
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


      const imagePath = `img/recent/${photofile}`;

      const htmlDescription = markdownToHtml(description, variable);

      //画像が存在するか？->onerror処理を入れるのでいらなくなりました
      //const exists = await checkImage(imagePath);
      // 存在しなかった場合のみ、no-image.pngに更新
      //if (!exists) {
      //  photofile = 'no-image.webp';
      //}

      // HTML文字列を返す
      return `
                <div class="row reveal small-info">
                    <div class="coming-photo">
                        <img
                          src="img/recent/${photofile}"
                          alt
                          onerror="this.onerror = null; this.src='img/recent/no-image';"
                        />
                    </div>
                    <div class="col-sm-8" style="font-size: 18px">
                        <span class="small-info-tag" style="background-color:${tagBcColor};">${tag}</span>
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
    listElement.innerHTML = '';

    // 全てのHTMLをDOMに追加
    htmlContents.forEach(html => {
      const listItem = document.createElement('li');
      listItem.innerHTML = html;
      listElement.appendChild(listItem);
    });
    const listItem = document.createElement('li');
    listItem.innerHTML = `
                <div 
                    class="row reveal" 
                    style="
                        font-size: clamp(1.2rem, 2vw, 2rem);
                        text-align:center;
                        color:#838383;"
                        white-space: nowrap;
                        overflow: hidden;
                >
                &gt&gtこの他にも多くの活動を実施しています🍊&lt&lt
                <br>
                &gt&gt
                <a href="https://twitter.com/mikanclub1139">X</a>
                や
                <a href="https://www.instagram.com/mikanfanclub/">Instagram</a>
                もご覧ください！&lt&lt
                </div>`;
    listElement.appendChild(listItem);

  } catch (error) {
    console.error('データの取得中にエラーが発生しました:', error);
    listElement.innerHTML = `<li>データの読み込みに失敗しました。詳細: ${error.message}</li>`;
  }
}

fetchAndDisplayActivities();

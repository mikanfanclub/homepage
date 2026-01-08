//https://docs.google.com/spreadsheets/d/18TiiB6T8RIK0w4xrXWO7v_pQJeVhmuzOqYELstQDZ1k/edit?usp=sharing

// 【要変更】Google SpreadsheetのIDに置き換えてください
const SPREADSHEET_ID = '18TiiB6T8RIK0w4xrXWO7v_pQJeVhmuzOqYELstQDZ1k';

// 【要変更】シートのGID（通常は0、URLの#gid=XXの部分）に置き換えてください
const SHEET_GID = '0';

// Google Visualization APIのURLを構築
const API_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?gid=${SHEET_GID}&tqx=out:json`;

export class SheetProvider {
  constructor(spreadsheetId = SPREADSHEET_ID, sheetGid = SHEET_GID) {
    this.spreadsheetId = spreadsheetId;
    this.sheetGid = sheetGid;
    this.apiUrl = `https://docs.google.com/spreadsheets/d/${this.spreadsheetId}/gviz/tq?gid=${this.sheetGid}&tqx=out:json`;
    this.rows = null;
  }

  async init(messageElement) {

    messageElement.innerHTML = '<li class="activities-list-foot-message" >データを取得中です...</li>';

    try {
      const response = await fetch(this.apiUrl);
      const text = await response.text();

      // JSONP Paddingの除去
      const jsonText = text
        .replace(/^\s*\/\*.*?\*\/\s*google\.visualization\.Query\.setResponse\s*\(/, '')
        .replace(/\);\s*$/, '');

      const data = JSON.parse(jsonText);
      this.rows = data.table.rows;
      return this.rows;
    }
    catch (error) {
      console.error('データの取得中にエラーが発生しました:', error);
      throw error;
    }
  }

  getRows(start_row = 0, max_rows = 5) {
    if (!this.rows || this.rows.length <= 1) {
      return [];
    }
    // 最新の行を取得し、逆順にする（最新が上）
    const targetRows = this.rows.slice(0).reverse().slice(start_row, start_row + max_rows);
    return targetRows;
  }

  async dispActivities(listElement, start_row = 0, max_rows = 5, mode = 'replace', partition = false) {

    let prevMonth = null;

    if (this.rows[start_row - 1]) {
      const prevDate = new Date(this.rows[start_row - 1].c[1].f);
      prevMonth = prevDate.getMonth() + 1;
    }


    const targetRows = this.getRows(start_row, max_rows);


    const htmlContents = targetRows.map(async (row, index) => {
      // データ取得
      const title = row.c[0] && row.c[0].v !== null ? row.c[0].v : 'タイトルなし';
      const date = row.c[1] && row.c[1].f ? row.c[1].f : '日付なし';
      const description = row.c[2] && row.c[2].v !== null ? row.c[2].v : '説明なし';
      let photofile = row.c[3] && row.c[3].v !== null ? row.c[3].v : 'no-image.webp';
      let raw_variable = row.c[4] && row.c[4].v !== null ? row.c[4].v : '';
      let variable = raw_variable.split(',').map(v => v.trim());
      let raw_tag = row.c[5] && row.c[5].v !== null ? row.c[5].v : 'その他';
      let tag = raw_tag.split(',');

      let monthLabel = '';
      if (partition) {
        const rowDate = new Date(row.c[1].f);
        const rowMonth = rowDate.getMonth() + 1;
        const rowYear = rowDate.getFullYear();
        if (rowMonth !== prevMonth) {
          monthLabel = `
          <div style="display:flex;align-items:center;align-items:end;margin-top:2rem;margin-bottom:1rem;border-bottom:1px solid #ddd;padding-bottom:0.5rem;">
            <div class="activities-year-label" style="color:#aaa;margin-bottom:5px;">${rowYear}</div> 
            <div style="display:flex;align-items:center;justify-content:center;height:5rem;width:100%">
              <svg xmlns="http://www.w3.org/2000/svg" width="3rem" height="3rem" viewBox="0 0 40 40">
                <ellipse cx="20" cy="20" rx="20" ry="18" fill="#ff9800" />
                <path d="M20 6 Q25 0 35 3 Q28 8 20 6" fill="green" />
                <path d="M20 8 L20 2" stroke="green" stroke-width="1" />
                <circle cx="10" cy="10" r="1" fill="#fff" opacity="0.5" />
              </svg>
              <h2 class="activities-month-label">${rowMonth}月</h2>
            </div>
          </div>`;
          prevMonth = rowMonth;
        }
      }

      // タグのHTML生成

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
      return `${monthLabel}
                <div class="row reveal small-info">
                    <div class="coming-photo">
                        <img
                          src="/img/recent/${photofile}"
                          alt
                          onerror="this.onerror = null; this.src='/img/recent/no-image.webp';"
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
    const htmlContentsResolved = await Promise.all(htmlContents);

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
    htmlContentsResolved.forEach(html => {
      const listItem = document.createElement('li');
      listItem.innerHTML = html;
      listElement.appendChild(listItem);
    });

    if (this.rows.length - 1 > max_rows + start_row) { return true; } else { return false; }
  }

}


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


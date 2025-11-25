//https://docs.google.com/spreadsheets/d/1uzGrDO4oCOyuPEFkTdzgRzZtf3ZAZngqgIHJu7l32Sw/edit#gid=0

// 【要変更】Google SpreadsheetのIDに置き換えてください
const SPREADSHEET_ID = '1uzGrDO4oCOyuPEFkTdzgRzZtf3ZAZngqgIHJu7l32Sw';

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
            let photofile = row.c[3] && row.c[3].v !== null ? row.c[3].v : 'no-image.png';

            const imagePath = `img/recent/${photofile}`;

            // ⭐ await で画像の存在確認が完了するのを待つ
            const exists = await checkImage(imagePath);

            // 存在しなかった場合のみ、no-image.pngに更新
            if (!exists) {
                photofile = 'no-image.png';
            }

            // HTML文字列を返す
            return `
                <div class="row reveal small-info">
                    <div class="coming-photo">
                        <img src="img/recent/${photofile}" alt="${title}" />
                    </div>
                    <div class="col-sm-8" style="font-size: 18px">
                        <p>
                        <span class="small-info-title"> ${title} </span>
                        <span class="small-info-date">${date}</span>
                        </p>
                        <span class="small-info-inner">
                        <p>${description}
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
                        font-size:larger;
                        text-align:center;
                        color:#838383;"
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
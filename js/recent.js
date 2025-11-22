//https://docs.google.com/spreadsheets/d/1uzGrDO4oCOyuPEFkTdzgRzZtf3ZAZngqgIHJu7l32Sw/edit#gid=0


// 【要変更】Google SpreadsheetのIDに置き換えてください
const SPREADSHEET_ID = '1uzGrDO4oCOyuPEFkTdzgRzZtf3ZAZngqgIHJu7l32Sw';

// 【要変更】シートのGID（通常は0、URLの#gid=XXの部分）に置き換えてください
const SHEET_GID = '0';

// Google Visualization APIのURLを構築
// tqx=out:json は、JSONP形式の応答を確実に受け取るために重要です
const API_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?gid=${SHEET_GID}&tqx=out:json`;

// 表示する行数（最後から数える）
const MAX_ROWS = 5;

// HTMLの要素
const listElement = document.getElementById('activities-list');

/**
 * Google Sheetsのデータを取得し、HTMLに表示する関数
 */
async function fetchAndDisplayActivities() {
    listElement.innerHTML = '<li>データを取得中です...</li>'; // ロード中のメッセージ更新

    try {
        const response = await fetch(API_URL);
        const text = await response.text();

        // ----------------------------------------------------
        // ★ 修正箇所：JSONP Paddingの除去をより汎用的に行う
        // ----------------------------------------------------

        // 正規表現で、先頭のコメントとJSONP関数コール、末尾のカッコを削除
        // \s*は改行や空白に対応。.*?は非貪欲マッチでコメント全体に対応。
        const jsonText = text
            // 1. 先頭の /*O_o*/ や google.visualization.Query.setResponse( を削除
            .replace(/^\s*\/\*.*?\*\/\s*google\.visualization\.Query\.setResponse\s*\(/, '')
            // 2. 末尾の ); とそれに続く空白、改行を削除
            .replace(/\);\s*$/, '');

        // 念のため、エラー時にjsonTextを確認できるようにconsole.logを残しておくとデバッグに役立ちます
        // console.log("Parsed JSON Text:", jsonText); 

        const data = JSON.parse(jsonText);

        const rows = data.table.rows;

        if (!rows || rows.length <= 1) { // ヘッダー行のみの場合も考慮
            listElement.innerHTML = '<li>活動データがありません。</li>';
            return;
        }

        // 📝 最新の5行を取得するロジック
        // .slice(1)でヘッダー行（1行目）を除去
        // .slice(-MAX_ROWS)でリストの最後から5要素を取得（最新の5件）
        const recentRows = rows.slice(0).slice(-MAX_ROWS);

        // リスト要素をクリア
        listElement.innerHTML = '';

        // 抽出した行を逆順（最新が上）にして表示する
        recentRows.reverse().forEach(row => {
            // ----------------------------------------------------
            // ★ 修正箇所：日付データは 'f' (formatted value) から取得する
            // ----------------------------------------------------

            // データはc[0] (A列), c[1] (B列:日付), c[2] (C列) に対応
            const title = row.c[0] && row.c[0].v !== null ? row.c[0].v : 'タイトルなし';

            // 日付は 'f' (フォーマット済みの値) を利用
            const date = row.c[1] && row.c[1].f ? row.c[1].f : '日付なし';

            const description = row.c[2] && row.c[2].v !== null ? row.c[2].v : '説明なし';

            const photofile = row.c[3] && row.c[3].v !== null ? row.c[3].v : 'no-image.png';

            const listItem = document.createElement('li');

            // 表示形式: 【年月日】タイトル: 短文紹介
            // listItem.innerHTML = `
            //     <strong>【${date}】${title}</strong>: 
            //     <span class="description">${description}</span>
            // `;

            listItem.innerHTML = `
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
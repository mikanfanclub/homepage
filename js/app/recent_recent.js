import { SheetProvider } from "./sheet_provider.js";

const listElement = document.getElementById('activities-list');
const listFooter = document.getElementById('activities-list-footer');

// URLから現在のページ数を取得（なければ1ページ目）
const urlParams = new URLSearchParams(window.location.search);
let currentPage = parseInt(urlParams.get('page')) || 0;

const maxRows = 8;

const activitiesProvider = new SheetProvider();


async function init() {

  await activitiesProvider.init(listElement);

  // ページ数に合わせて取得する件数を計算（例: 2ページ目なら 2 * 5 = 10件）
  const initialRowsToFetch = (currentPage + 1) * maxRows;


  const hasNext = await activitiesProvider.dispActivities(listElement, 0, initialRowsToFetch, "replace");;

  if (hasNext) {
    renderLoadMoreButton();
  }
}

async function renderLoadMoreButton() {
  listFooter.innerHTML = `<button id="load-more-button"><I class="fa fa-solid fa-caret-down"></i>　もっと見る</button>`;
  const loadMoreButton = document.getElementById('load-more-button');

  loadMoreButton.addEventListener('click', async () => {
    loadMoreButton.disabled = true;

    // 現在の表示件数を開始位置にする
    const currentDisplayedCount = (currentPage + 1) * maxRows;
    const hasNext = await activitiesProvider.dispActivities(listElement, currentDisplayedCount, maxRows, "append");

    if (hasNext) {
      currentPage++;
      // URLを更新（再読み込みはさせない）
      updateUrl(currentPage);
      loadMoreButton.disabled = false;
    } else {
      currentPage++;
      // URLを更新（再読み込みはさせない）
      updateUrl(currentPage);

      listFooter.innerHTML = '';
    }
  });
}

// URLのパラメータだけを書き換える関数
function updateUrl(page) {
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('page', page);
  // pushStateを使うと、画面遷移させずにURLだけ変えられる
  window.history.replaceState({}, '', newUrl);
}

init();

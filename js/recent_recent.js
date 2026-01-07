import { fetchAndDisplayActivities } from "./recent_fetch.js";

const listElement = document.getElementById('activities-list');
const listFooter = document.getElementById('activities-list-footer');

// URLから現在のページ数を取得（なければ1ページ目）
const urlParams = new URLSearchParams(window.location.search);
let currentPage = parseInt(urlParams.get('page')) || 0;

const maxRows = 5;

async function init() {
  // ページ数に合わせて取得する件数を計算（例: 2ページ目なら 2 * 5 = 10件）
  const initialRowsToFetch = (currentPage + 1) * maxRows;

  // 0行目から、現在のページ分までを一気に取得
  let hasNext = await fetchAndDisplayActivities(listElement, 0, initialRowsToFetch);

  if (hasNext) {
    renderLoadMoreButton();
  }
}

function renderLoadMoreButton() {
  listFooter.innerHTML = `<button id="load-more-button">▶▶もっと見る</button>`;
  const loadMoreButton = document.getElementById('load-more-button');

  loadMoreButton.addEventListener('click', async () => {
    loadMoreButton.disabled = true;

    // 現在の表示件数を開始位置にする
    const currentDisplayedCount = (currentPage + 1) * maxRows;
    const hasNext = await fetchAndDisplayActivities(listElement, currentDisplayedCount, maxRows, 'append');

    if (hasNext) {
      currentPage++;
      // URLを更新（再読み込みはさせない）
      updateUrl(currentPage);
      loadMoreButton.disabled = false;
    } else {
      listFooter.innerHTML = '';
    }
  });
}

// URLのパラメータだけを書き換える関数
function updateUrl(page) {
  const newUrl = new URL(window.location);
  newUrl.searchParams.set('page', page);
  // pushStateを使うと、画面遷移させずにURLだけ変えられる
  window.history.pushState({}, '', newUrl);
}

init();

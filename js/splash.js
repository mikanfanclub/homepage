window.addEventListener('load', () => {
    const splash = document.getElementById('splash-window');
    
    // 1. 指定時間後にフェードアウトを開始 (クラス追加)
    setTimeout(() => {
        
        // ★★★ 追加：強制リフロー（画面の再描画）のトリガー ★★★
        // ブラウザに現在のopacity: 1の状態を認識させる
        void splash.offsetHeight; 
        
        splash.classList.add('hidden-splash'); // フェードアウト開始
    }, 1000); 

    // 2. フェードアウトが終わるのを待ってから要素を完全に非表示にする
    splash.addEventListener('transitionend', () => {
        splash.style.display = 'none';
    }, { once: true });
});
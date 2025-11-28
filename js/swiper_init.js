
// 1. 初期化の対象となるコンテナのセレクタを指定
//    ここではHTMLで定義したクラス名「.swiper」を指定
const mySwiper = new Swiper("#swiper1", {
    // 2. ここに各種オプションを設定 (例: スライドモード、スピード、ループなど)

    // オプション例:
    direction: "horizontal", // スライドの方向: 'horizontal' または 'vertical'
    loop: true, // ループ再生を有効にする
    centeredSlides: true,
    slidesPerView: 1, // 一度に表示するスライドの枚数
    spaceBetween: 30, // スライド間のスペース (px)

    effect: 'coverflow', // エフェクトの種類
    coverflowEffect: {
        rotate: 50, // 傾き
        slideShadows: false, // 影を有効化
    }
    ,
    autoplay: {
        delay: 3000, // 自動再生の遅延時間 (ミリ秒)
        disableOnInteraction: false, // ユーザー操作後も自動再生を継続
    },
    speed: 800, // スライドの切り替え速度 (ミリ秒)

    // 3. ナビゲーション要素の関連付け
    // pagination: {
    //     el: ".swiper-pagination", // ページネーションの要素を指定
    //     clickable: true, // クリックで移動を有効化
    // },
    scrollbar: {
        el: '.swiper-scrollbar', // HTML要素のセレクタを指定
        hide: true,              // 操作時以外は非表示にするか
    },
    navigation: {
        nextEl: ".custom-next-btn", // 次へボタンの要素を指定
        prevEl: ".custom-prev-btn", // 前へボタンの要素を指定
    },

    // 4. レスポンシブ設定 (ブレイクポイント)
    breakpoints: {
        // 768px以上の画面幅で適用される設定
        768: {
            slidesPerView: 1,
            spaceBetween: 40,
            centeredSlides: true,
        },
        // 1024px以上の画面幅で適用される設定
        1024: {
            slidesPerView: 1,
            spaceBetween: 50,
            centeredSlides: true,
        },
    },
});




// 1. 初期化の対象となるコンテナのセレクタを指定
//    ここではHTMLで定義したクラス名「.swiper」を指定
const mySwiper2 = new Swiper("#swiper2", {
    // 2. ここに各種オプションを設定 (例: スライドモード、スピード、ループなど)

    // オプション例:
    direction: "horizontal", // スライドの方向: 'horizontal' または 'vertical'
    loop: true, // ループ再生を有効にする
    slidesPerView: 2.5, // 一度に表示するスライドの枚数
    spaceBetween: 0, // スライド間のスペース (px)
    centeredSlides: true,

    effect: 'slides', // エフェクトの種類
    autoplay: {
        delay: 3000, // 自動再生の遅延時間 (ミリ秒)
        disableOnInteraction: false, // ユーザー操作後も自動再生を継続
    },
    speed: 800, // スライドの切り替え速度 (ミリ秒)

    // 3. ナビゲーション要素の関連付け
    // pagination: {
    //     el: ".swiper-pagination", // ページネーションの要素を指定
    //     clickable: true, // クリックで移動を有効化
    // },
    scrollbar: {
        el: '.swiper-scrollbar', // HTML要素のセレクタを指定
        hide: true,              // 操作時以外は非表示にするか
    },
    navigation: {
        nextEl: ".custom-next-btn", // 次へボタンの要素を指定
        prevEl: ".custom-prev-btn", // 前へボタンの要素を指定
    },

    // 4. レスポンシブ設定 (ブレイクポイント)
    breakpoints: {
        // 768px以上の画面幅で適用される設定
        768: {
            slidesPerView: 3,
            // spaceBetween: 40,
        },
        // 1024px以上の画面幅で適用される設定
        1024: {
            slidesPerView: 5,
            // spaceBetween: 50,
        },
    },
});
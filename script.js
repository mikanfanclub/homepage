let MIKAN;
let cy;

function getUniqueStr(myStrong) {
  var strong = 1000;
  if (myStrong) strong = myStrong;
  return new Date().getTime().toString(16) + Math.floor(strong * Math.random()).toString(16)
}

async function init() {
  try {
    const response = await fetch('mikan.json');
    MIKAN = await response.json();


    const datalist = document.getElementById('mikanList');
    const searchInput = document.getElementById('mikanSearch');
    const targetInput = document.getElementById('targetId');

    // 検索候補（datalist）を作成
    MIKAN.forEach(m => {
      if (m.id < 10000) {
        const option = document.createElement('option');
        option.value = m.names[0]; // ユーザーに見える名前
        option.dataset.id = m.id;  // 内部的なIDを保持
        datalist.appendChild(option);
      }
    });

    // 入力されたときにIDに変換するイベント
    searchInput.addEventListener('change', function () {
      const selectedName = this.value;
      const found = MIKAN.find(m => m.names.includes(selectedName));
      if (found) {
        targetInput.value = found.id;
        drawGraph(); // 選択したら即座に描画更新
      }
    });

    setupCytoscape();

    const info = document.getElementById('info-panel');
    //if (info) info.innerText = `${MIKAN.length} 件読み込み完了`;
    if (info) info.innerText = `🍊柑橘をクリックすると詳細が見れます🍊`;

    drawGraph();
  } catch (e) {
    const info = document.getElementById('info-panel');
    if (info) info.innerText = '読み込み失敗...';
    console.error(e);
  }
}

function setupCytoscape() {
  cy = cytoscape({
    container: document.getElementById('cy'),
    style: [
      {
        selector: 'node',
        style: {
          'label': 'data(label)',
          'text-valign': 'bottom',
          'text-margin-y': '0px',
          'color': '#5a3e1b',
          'font-size': '10px',

          // --- 枠組みだけ大きく、中身は透明にする ---
          'width': '80px',  // 葉っぱ分を見越して大きめに確保
          'height': '85px',
          'background-opacity': 0, // Cytoscape標準の背景は消す
          'border-width': 0,

          // --- SVGで「実」と「葉っぱ」をまとめて描画 ---
          'background-image': function (node) {
            // 方向やレベルに合わせて色を変えるロジック
            let color = node.data('color') ?? '#ff9800';
            /*
             if (node.data('isDirect')) {
              color = node.data('dir') === 1 ? '#e65100' : '#ffb300';
            }
            */
            let svg = "";
            if (node.data('shape')) {
              if (node.data('shape') == "deko") {
                svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
                  <ellipse cx="30" cy="18" rx="7" ry="7" fill="${color}" />
                  <ellipse cx="30" cy="33" rx="20" ry="18" fill="${color}" />
                  <path d="M30 13 Q35 5 45 10 Q38 15 30 13" fill="green"  />
                  <path d="M30 15 L30 11" stroke="green" stroke-width="1" />
                </svg>`;

              } else if (node.data('shape') == "flat") {
                svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
                  <ellipse cx="30" cy="35" rx="20" ry="15" fill="${color}"/>
                  <path d="M30 21 Q35 13 45 18 Q38 23 30 21" fill="green" />
                  <path d="M30 23 L30 17" stroke="green" stroke-width="1" />
                </svg>`;
              } else if (node.data('shape') == "round") {
                svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
                  <ellipse cx="30" cy="35" rx="19" ry="19" fill="${color}"/>
                  <path d="M30 21 Q35 13 45 18 Q38 23 30 21" fill="green" />
                  <path d="M30 23 L30 17" stroke="green" stroke-width="1" />
                </svg>`;
              } else if (node.data('shape') == "egg") {
                svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
                  <ellipse cx="30" cy="35" rx="17" ry="20" fill="${color}"/>
                  <path d="M30 21 Q35 13 45 18 Q38 23 30 21" fill="green" />
                  <path d="M30 23 L30 17" stroke="green" stroke-width="1" />
                </svg>`;

              } else if (node.data('shape') == "unknown") {
                svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
                  <ellipse cx="30" cy="35" rx="20" ry="17" fill="${color}"/>
                  <path d="M30 21 Q35 13 45 18 Q38 23 30 21" fill="green" />
                  <path d="M30 23 L30 17" stroke="green" stroke-width="1" />
<text 
    x="30" 
    y="45" 
    font-family="Arial, sans-serif" 
    font-size="22" 
    font-weight="bold" 
    fill="white" 
    text-anchor="middle"
    style="pointer-events: none; drop-shadow: 0px 0px 2px rgba(0,0,0,0.5);"
  >?</text>
                </svg>`;

              } else {
                svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
                  <ellipse cx="30" cy="35" rx="20" ry="17" fill="${color}" />
                  <path d="M30 21 Q35 13 45 18 Q38 23 30 21" fill="green"/>
                  <path d="M30 23 L30 17" stroke="green" stroke-width="1" />
                </svg>`;
              }

            } else {
              svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60">
                  <ellipse cx="30" cy="35" rx="20" ry="17" fill="${color}" />
                  <path d="M30 21 Q35 13 45 18 Q38 23 30 21" fill="green"/>
                  <path d="M30 23 L30 17" stroke="green" stroke-width="1" />
                </svg>`;
            }
            return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

          },
          'background-fit': 'contain',
          'background-clip': 'none',
          'overlay-opacity':0,
        }
      },
      // 中心ノード（自分）だけ少し大きくする
      {
        selector: 'node[level = 0]',
        style: {
          'font-size': '12px'
        }
      },
      {
        selector: 'node[level=1]',
        style: {
        }
      },

      {
        selector: 'node[level=2]',
        style: {
        }
      },

      // --- 1. 祖先直系のスタイル ---
      {
        selector: 'node[?isDirect][dir = 1]',
        style: {
          'background-color': '#d90', // 明るい赤
          'border-color': '#fff',
          'color': '#fff',
          'text-outline-color': '#aaa',
          'text-outline-width': 2
        }
      },
      // --- 2. 子孫直系のスタイル ---
      {
        selector: 'node[?isDirect][dir = 2]',
        style: {
          'background-color': '#', // 明るい青
          'border-color': '#0059b3',
          'color': '#fff',
          'text-outline-color': '#aaa',
          'text-outline-width': 2
        }
      },
      // --- 3. 中心ノード (自分) ---
      {
        selector: 'node[level = 0]',
        style: {
          'background-color': '#e92',
          'color': '#fff',
          'font-size': '12px',
          'text-outline-color': '#aaa',
          'text-outline-width': 2
        }
      },
      // エッジの基本スタイル
      {
        selector: 'edge',
        style: {
          'curve-style': 'bezier', // または 'taxi'
          'control-point-step-size': 20, // 重なったエッジを少し膨らませて分離させる
          'target-arrow-shape': 'triangle',
          'line-color': '#ccc',
          'width': 2,
          'opacity': 0.4,
          'arrow-scale': 1.2,
          // 重なりを避けるための設定
          'ghost': 'yes',
          'ghost-offset-x': 1,
          'ghost-offset-y': 1,
          'ghost-opacity': 0.3,
          'source-endpoint': 'inside-to-node',
          'target-endpoint': 'inside-to-node',
          'source-distance-from-node': 30,
          'target-distance-from-node': 30,
          'overlay-opacity':0,
        }
      },
      // --- 4. エッジのスタイル分け ---
      {
        selector: 'edge[type = "ancestor"]',
        style: {
          'line-color': '#00ad46',
          'target-arrow-color': '#00ad46',
          'width': 3,
          'opacity': 0.7
        }
      },
      {
        selector: 'edge[type = "descendant"]',
        style: {
          'line-color': '#fa2',
          'target-arrow-color': '#fa2',
          'width': 3,
          'opacity': 0.7
        }
      }
    ],
    minZoom: 0.5,  // 最小倍率
    maxZoom: 1.8,  // 最大倍率
    autoungrabify: true,
  });

  cy.on('tap', 'node', function (evt) {
    const node = evt.target;
    //const targetInput = document.getElementById('targetId');
    //if (targetInput) targetInput.value = node.id();
    const m = MIKAN.find(x => x.id === parseInt(node.id()));

    // IDをセット
    const targetInput = document.getElementById('targetId');
    if (targetInput) targetInput.value = node.id();

    // 【追記】検索ボックスの表示名も更新
    const searchInput = document.getElementById('mikanSearch');
    if (searchInput) searchInput.value = m.names[0];
    drawGraph();

    const p1 = MIKAN.find(x => x.id === m.p1);
    const p2 = MIKAN.find(x => x.id === m.p2);
    const info = document.getElementById('info-panel');
    if (info) {
      info.innerHTML = `
        <h3>${m.names[0]}</h3>${m.names.length > 1 ? `<span class="other-names">(${m.names.slice(1).join(',')})</span>` : ""}<br>
        <div class="origin">${p1 ? (p2 ? ` 親 :${p1.names[0]}×${p2.names[0]}` : `親:${p1.names[0]}`) : ''}</div>
        <div>${m.note}</div>
      `;
    }
  });
  // setupCytoscape 内に追記
  cy.on('mouseover', 'node', function (e) {
    const sel = e.target;
    // つながっているエッジと隣接ノードだけ光らせる
    sel.outgoers('edge').animate({ style: { 'width': 3, 'opacity': 1, 'line-color': '#d80', 'target-arrow-color': '#d80' } });
    sel.incomers('edge').animate({ style: { 'width': 3, 'opacity': 1, 'line-color': '#146836', 'target-arrow-color': '#146836' } });
  });

  cy.on('mouseout', 'node', function (e) {
    const sel = e.target;
    sel.outgoers('edge').stop().removeStyle();
    sel.incomers('edge').stop().removeStyle();
  })
}

function drawGraph() {
  const targetEl = document.getElementById('targetId');
  const hopsEl = document.getElementById('hops');
  const centerId = targetEl ? targetEl.value.toString() : "1";
  const maxHops = hopsEl ? parseInt(hopsEl.value) : 2;

  const centerNode = cy.getElementById(centerId);
  const startPos = centerNode.length > 0 ? centerNode.position() : { x: cy.width() / 2, y: cy.height() / 2 };

  // Map<id, [level, direction, isDirect]>
  const nodesWithLevels = new Map();

  function collectIds(currentId, hops, level, direction, isDirectLine) {
    if (hops < 0 || currentId === -1 || currentId === undefined) return;

    const prev = nodesWithLevels.get(currentId);
    if (!prev) {
      nodesWithLevels.set(currentId, [level, direction, isDirectLine]);
    } else {
      const [oldLevel, oldDir, oldDirect] = prev;
      // より浅い階層、または直系フラグが立つ方を優先
      if (level < oldLevel || (!oldDirect && isDirectLine)) {
        nodesWithLevels.set(currentId, [level, direction, isDirectLine || oldDirect]);
      } else if (level > oldLevel) {
        return;
      }
    }

    const m = MIKAN.find(x => x.id === currentId);
    if (!m) return;

    // 祖先方向 (direction: 1)
    const isParentDirect = isDirectLine && (direction === 0 || direction === 1);
    collectIds(m.p1, hops - 1, level + 1, 1, isParentDirect);
    collectIds(m.p2, hops - 1, level + 1, 1, isParentDirect);

    // 子孫方向 (direction: 2)
    const isChildDirect = isDirectLine && (direction === 0 || direction === 2);
    MIKAN.filter(c => c.p1 === currentId || c.p2 === currentId).forEach(child => {
      collectIds(child.id, hops - 1, level + 1, 2, isChildDirect);
    });
  }

  collectIds(parseInt(centerId), maxHops, 0, 0, true);

  const elementsData = [];
  nodesWithLevels.forEach((value, id) => {
    const m = MIKAN.find(x => x.id === id);
    let sid = String(m.id);
    if (m.id == 1000) {
      sid = "";
    }
    const existing = cy.getElementById(sid);
    const isNew = existing.length === 0;

    elementsData.push({
      group: 'nodes',
      data: {
        id: sid,
        label: m.names[0],
        color: m.color,
        shape: m.shape,
        level: value[0],
        dir: value[1],
        isDirect: value[2]
      },
      position: !isNew ? existing.position() : { x: startPos.x, y: startPos.y },
      classes: isNew ? 'new-node' : ''
    });
  });

  MIKAN.forEach(m => {
    if (nodesWithLevels.has(m.id)) {
      [m.p1, m.p2].forEach(parentId => {
        if (parentId !== -1 && nodesWithLevels.has(parentId)) {
          const eid = `e${parentId}-${m.id}`;

          // ノードのデータから方向性を判定
          const childData = nodesWithLevels.get(m.id);
          const parentData = nodesWithLevels.get(parentId);

          let edgeType = 'normal';
          // 両方が直系であり、かつ同じ方向の系統なら色付け
          if (childData[2] && parentData[2]) {
            if (childData[1] === 1 || parentData[1] === 1) edgeType = 'ancestor';
            if (childData[1] === 2 || parentData[1] === 2) edgeType = 'descendant';
          }

          elementsData.push({
            group: 'edges',
            data: {
              id: eid,
              source: String(parentId),
              target: String(m.id),
              type: edgeType // ここでタイプを指定
            }
          });
        }
      });
    }
  });
  cy.elements().remove();
  const addedEles = cy.add(elementsData);

  addedEles.filter('.new-node, .new-edge').style('opacity', 0);
  const layout = cy.layout({
    name: 'concentric',
    concentric: function (node) {
      // 階層ごとに円を分ける（これは維持）
      return (10 - node.data('level')) * 10;
    },
    levelWidth: () => 10,

    // ここがキモ：円周上の並び順を「方向」で決定する
    sort: (a, b) => {
      // 方向(dir)の優先度を決める
      // 1:祖先(上), 0:自分(中心), 3:混合, 2:子孫(下)
      // 傍系(isDirectでないもの)はこれらの中間に散らす
      const getOrder = (n) => {
        const dir = n.data('dir');
        const isDirect = n.data('isDirect');
        if (dir === 1 && isDirect) return 1; // 祖先（最優先：真上付近）
        if (!isDirect) return 2;             // 傍系（横に広がる）
        if (dir === 2 && isDirect) return 3; // 子孫（最後の方：真下付近）
        return 1.5;
      };
      return getOrder(a) - getOrder(b);
    },

    startAngle: 3 / 2 * Math.PI, // 12時方向から祖先を開始
    clockwise: true,             // 時計回り
    equidistant: false,          // 密度を調整
    padding: 80,
    animate: true,
    animationDuration: 800,
    fit: true
  });
  layout.promiseOn('layoutstop').then(() => {
    // 画面全体を中央に収める
    cy.fit(undefined, 50); // 50pxのパディング

    // 画面幅が600px未満（スマホ）の場合、少しズームアウトして全体を見やすくする
    if (window.innerWidth < 600) {
      const currentZoom = cy.zoom();
      cy.zoom(currentZoom * 1.5); // 現在の倍率から20%引く
      cy.center(); // 中央揃え
    }
  });
  layout.run();
  addedEles.filter('.new-node, .new-edge').animate({
    style: { 'opacity': 1 },
    duration: 500
  });

}

let resizeTimer;
window.addEventListener('resize', function() {
  // リサイズ中に何度も実行されると重いので、少し待ってから実行（デバウンス）
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function() {
    cy.fit(undefined, 50);
    if (window.innerWidth < 600) {
      cy.zoom(cy.zoom() * 0.8);
    }
    cy.center();
  }, 200);
});

window.onload = init;

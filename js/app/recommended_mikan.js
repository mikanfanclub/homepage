
const mikanCard = document.getElementById('recommended-mikan').getElementsByClassName('mikan-card')[0];
const mikanIcon = mikanCard.getElementsByClassName('mikan-icon')[0];
const mikanInfo = mikanCard.getElementsByClassName('mikan-info')[0];
window.onload = async () => {
  let mikanList = [400];
  switch (new Date().getMonth()) {
    case 0: // January
      mikanList = [0, 24, 20, 200, 301, 400];
      break;
    case 1: // February
      mikanList = [200, 201, 20, 301, 300, 400];
      break;
    case 2: // March
      mikanList = [300, 301, 500, 46];
      break;
    case 3: // April
      mikanList = [61, 133, 308];
      break;
    case 4: // May
      mikanList = [25, 135, 600];
      break;
    case 5: // June
      mikanList = [84, 602];
      break;
    case 6: // July
      mikanList = [84];
      break;
    case 7: // August
      mikanList = [701, 702];
      break;
    case 8: // September
      mikanList = [102];
      break;
    case 9: // October
      mikanList = [100, 102];
      break;
    case 10: // November
      mikanList = [101, 102];
      break;
    case 11: // December
      mikanList = [45, 400, 11, 305];
      break;
  }
  const mikanId = mikanList[Math.floor(Math.random() * mikanList.length)];

  try {
    const response = await fetch('/pages/mikan-graph/mikan.json');
    const MIKAN = await response.json();
    console.log(MIKAN);
    const targetMikan = MIKAN.find(mikan => mikan.id === mikanId);
    if (targetMikan) {
      const color = targetMikan.color || "#ff9800";
      let svg = "";
      if (targetMikan.shape == "deko") {
        svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 40 40">
<ellipse cx="20" cy="24" rx="16" ry="16" fill="${color}" />
<ellipse cx="20" cy="10" rx="5" ry="5" fill="${color}" />
            <path d="M20 6 Q25 0 35 3 Q28 8 20 6" fill="green" />
            <path d="M20 6 L20 2" stroke="green" stroke-width="1" />
            <circle cx="15" cy="15" r="1" fill="#fff" opacity="0.5" />
          </svg>`;

      } else if (targetMikan.shape == "flat") {
        svg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 40 40">
            <ellipse cx="20" cy="20" rx="20" ry="18" fill="${color}" />
            <path d="M20 6 Q25 0 35 3 Q28 8 20 6" fill="green" />
            <path d="M20 8 L20 2" stroke="green" stroke-width="1" />
            <circle cx="10" cy="10" r="1" fill="#fff" opacity="0.5" />
          </svg>`;
      } else if (targetMikan.shape == "round") {
        svg = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 40 40">
            <ellipse cx="20" cy="20" rx="20" ry="18" fill="${color}" />
            <path d="M20 6 Q25 0 35 3 Q28 8 20 6" fill="green" />
            <path d="M20 8 L20 2" stroke="green" stroke-width="1" />
            <circle cx="10" cy="10" r="1" fill="#fff" opacity="0.5" />
          </svg>`;
      } else {
        svg = `
               <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 40 40">
<ellipse cx="20" cy="20" rx="20" ry="18" fill="${color}" />
            <path d="M20 6 Q25 0 35 3 Q28 8 20 6" fill="green" />
            <path d="M20 8 L20 2" stroke="green" stroke-width="1" />
            <circle cx="10" cy="10" r="1" fill="#fff" opacity="0.5" />
          </svg>`;
      }
      mikanIcon.innerHTML = svg;

    }
    mikanInfo.getElementsByTagName('h3')[0].innerText = `推し柑橘紹介：『${targetMikan.names[0]}』`;
    mikanInfo.getElementsByTagName('p')[0].innerText = targetMikan.note || '説明文がありません。';
    mikanInfo.getElementsByClassName('link-wrapper')[0].getElementsByTagName('a')[0].href = `/pages/mikan-graph/?target=${targetMikan.id}`;
  } catch (error) {
    console.error('Error fetching mikan data:', error);
  }
};



import { fetchAndDisplayActivities } from "./recent_fetch.js";

// HTMLの要素
const listElement = document.getElementById('activities-list');

fetchAndDisplayActivities(listElement, 0,5);

const listFooter = document.getElementById('activities-list-footer');
listFooter.innerHTML = `
                <div 
                    class="row reveal" 
                    style="
                        font-size: clamp(1.2rem, 2vw, 2rem);
                        text-align:center;
                        color:#838383;"
                        white-space: nowrap;
                        overflow: hidden;
                >
                <a href="https://twitter.com/mikanclub1139">X</a>
                や
                <a href="https://www.instagram.com/mikanfanclub/">Instagram</a>
                もご覧ください!
                </div>`;

import { SheetProvider} from "./sheet_provider.js";

// HTMLの要素
const listElement = document.getElementById('activities-list');

const activitiesProvider = new SheetProvider();
await activitiesProvider.init(listElement);

await activitiesProvider.dispActivities(listElement, 0, 4, "replace");

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

let links = [];
let pathToFinal;

browser.browserAction.onClicked.addListener(buttonClock);
//browser.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT = 1

browser.contextMenus.create({
    id: "smol",
    title: "Clip 10 segments (~20s)",
    contexts: ["all"],
    icons: {
        "16": "icons/64_049.png",
        "32": "icons/64_049.png"
      }
});

browser.contextMenus.create({
    id: "big",
    title: "Clip 20 segments (~40s)",
    contexts: ["all"],
    icons: {
        "16": "icons/64_038.png",
        "32": "icons/64_038.png"
      }
});

browser.contextMenus.create({
    id: "full",
    title: "Clip all segments (~60s)",
    contexts: ["all"],
    icons: {
        "16": "icons/64_040.png",
        "32": "icons/64_040.png"
      }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
      case "smol":
        tab.url.includes("rumble") ? dicksDownloader(5) : dicksDownloader(10);
    }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
      case "big":
        tab.url.includes("rumble") ? dicksDownloader(10) : dicksDownloader(20);
    }
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {
      case "full":
        dicksDownloader(0);
    }
});
        
function buttonClock(tab){
    tab.url.includes("rumble") ? dicksDownloader(4) : dicksDownloader(8);
}

function messageHandler(callback) {
    //console.log(callback);
    let url = callback.url;
    let strem = callback.documentUrl
    let method = callback.method
    //let id = callback.requestId
    
    if(method == "GET" && strem.includes("twitch") || method == "GET" && strem.includes("kick") || method == "GET" && strem.includes("fansly") || method == "GET" && strem.includes("rumble")){
        links.push([strem, url]);
        //console.log(links)
    }
    
    let uniques = [];
    let thisCount = 0;
    for (var l in links){ //check n of url for strem
        if (!uniques.includes(links[l][0])){
            uniques.push(links[l][0]);
            //console.log(uniques);
        }
        if(links[l][0] == strem){
            thisCount++;
        }
    }
    // * uniques.length
    if(thisCount >= 30){
        var first;
        for (var l in links){
            if(links[l][0] == strem){
                first = links[l];
                break;
            }
        }
        var index = links.indexOf(first);
        if (index > -1) {
            links.splice(index, 1); 
        }
    }
}

function pad(num) {
    return num.toString().padStart(2, "0");
}

function dicksDownloader(size){
    let filteredUrls = [];
    //console.log(links.join())
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        let tab = tabs[0];
        if (tab.url.includes("twitch") || tab.url.includes("kick") || tab.url.includes("fansly") || tab.url.includes("rumble")){
            for (var l in links){
                //console.log(links[l][0] + "  ==  " + tab.url);
                if(links[l][0] == tab.url){
                    filteredUrls.push(links[l][1]);
                    //console.log("yo "+ filteredUrls);
                }
            }
            if (filteredUrls.length > 0){
                if(size > 0 && filteredUrls.length >= size){
                    filteredUrls = filteredUrls.slice(Math.max(filteredUrls.length - size, 0))
                    //console.log("ALOO")
                }
                //console.log(filteredUrls);
                var a = document.createElement("a");
                a.href = window.URL.createObjectURL(new Blob([filteredUrls.join('\n')],
                {type: "text/plain"}));
                var fileName = tab.url.slice(tab.url.lastIndexOf('/') + 1); // could change name for rumble but eh
                var date = new Date();
                var dateTime = "_" + date.getFullYear().toString() + (pad(date.getMonth()+1).toString()) + pad(date.getDate().toString()) + pad(date.getHours().toString()) + pad(date.getMinutes().toString()) + pad(date.getSeconds().toString());
                var finalName = fileName + dateTime + ".dicks";
                a.download = finalName;
                a.click();
            }
        }
    }, console.error);
}

browser.webRequest.onBeforeRequest.addListener(
    messageHandler,
    {urls: ["*://*/v1/segment/*", "*://*/live/*/*/*/*.ts"]}
    
)
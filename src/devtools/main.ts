// Register the panel in the DevTools
chrome.devtools.panels.create(
    "JSON to TypeScript",
    "images/icon32.png",
    "panel.html",
    (panel) => {
        console.log("JSON to TypeScript panel created", panel);
    }
);

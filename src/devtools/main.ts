// Register the panel in the DevTools
chrome.devtools.panels.create(
    "TypeFastDTO",
    "images/acorn-fill_32.png",
    "panel.html",
    (panel) => {
        console.log("TypeFastDTO panel created", panel);
    }
);

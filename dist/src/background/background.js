chrome.runtime.onInstalled.addListener(()=>{console.log("Расширение успешно установлено!"),chrome.storage.local.set({color:"#3aa757"}).then(o=>{console.log(o,"Успешно установлено")})});

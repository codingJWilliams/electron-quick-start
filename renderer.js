// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//var _require = require("remote").require;
//var { BrowserWindow } = _require("electron");
var fs = require("fs");
var code = fs.readFileSync("./code.secret", "utf-8");
var snoowrap = require("snoowrap");
var r = new snoowrap({
    userAgent: "TranscriberyThing - /u/voidcraftedgaming",
    clientId: "h5yiNpGGdCGsng",
    clientSecret: "",
    refreshToken: code.split("\n")[1],
    accessToken: code.split("\n")[0]
})
var tor = r.getSubreddit("TranscribersOfReddit");
tor.getNew().then(res => {
    document.write(res
            .filter(sub => sub.author === "transcribersofreddit")
            .filter(sub => sub.link_flair_text === "Unclaimed")
            .map(sub => `<h1>${sub.text}</h1>\n`).join(""))
        //document.write(JSON.stringify(res, null, 2).replace("\n", "<br>"))
})
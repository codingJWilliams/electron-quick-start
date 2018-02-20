// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//var _require = require("remote").require;
//var { BrowserWindow } = _require("electron");
var fs = require("fs");
var util = require("./utility");
var pass = [];
require("./node_modules/jQuery/tmp/jquery.js");
var subid = window.location.href.split("#")[1];

(async function() {
    util.getSub(subid).then(s => {
        //s.fetch().then(s => {
        console.log(s)
        $("#imgbox").attr("src", s.preview.images[0].source.url)

    })
})()
// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//var _require = require("remote").require;
//var { BrowserWindow } = _require("electron");
var fs = require("fs");
var util = require("./utility");
var pass = [];
require("./node_modules/jQuery/tmp/jquery.js");

(async function() {
    console.log("jQuery is loaded");
    var subs = await util.getSubmissions();
    subs = subs.filter(sub => !pass.includes(sub.id));
    console.log(subs[0].thumbnail)
    console.log(JSON.stringify(subs[0], null, 2))
    $("#imgbox").attr("src", subs[0].preview.images[0].source.url)
    $("#info").html("<br>" + subs[0].title)
    $("#smashbutton").click(function() {
        window.location.replace("file://" + __dirname + "/transStart.html#" + subs[0].id)
    });
    $("#passbutton").click(function() {
        pass.push(subs[0].id);
        subs.shift()
        $("#imgbox").attr("src", subs[0].preview.images[0].source.url)
        $("#info").html("<br>" + subs[0].title)
    });
})()
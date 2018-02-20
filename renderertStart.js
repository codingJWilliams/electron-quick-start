var subid = window.location.href.split("#")[1];
var fs = require("fs");
var util = require("./utility");
var pass = [];
require("./node_modules/jQuery/tmp/jquery.js");

util.getSub(subid).then(s => {
    //s.fetch().then(s => {
    console.log(s)
    $("#imgbox").attr("src", s.preview.images[0].source.url)
        //})
    $("#go").click(function() {
        util.claim(subid).then(a => {
            window.location.replace(__dirname + "/trans.html#" + subid)
        })

    })
})
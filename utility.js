module.exports.getSubmissions = async() => {
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

    var res = await tor.getNew()
    return res
        .filter(sub => sub.author.name === "transcribersofreddit")
        .filter(sub => sub.link_flair_text === "Unclaimed");

}
module.exports.getSub = async(subid) => {
    var code = fs.readFileSync("./code.secret", "utf-8");
    var snoowrap = require("snoowrap");

    var r = new snoowrap({
        userAgent: "TranscriberyThing - /u/voidcraftedgaming",
        clientId: "h5yiNpGGdCGsng",
        clientSecret: "",
        refreshToken: code.split("\n")[1],
        accessToken: code.split("\n")[0]
    })
    return await r.getSubmission(subid).fetch()
}

module.exports.claim = async(subid) => {
    var sub = await module.exports.getSub(subid);
    sub.comments.forEach(com => {
        if (!com.body.startsWith("If you would like to claim this post,")) return;
        com.reply("claim")
    })
}
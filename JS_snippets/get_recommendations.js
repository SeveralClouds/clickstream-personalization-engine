var gaUserId = document.cookie.match(/_ga=(.+?);/)[1].split('.').slice(-2).join(".")
var host = "https://agri.clientpoc.sevc.link"

fetch(host + "/recommendations", {
    method: "POST",
    body: JSON.stringify({
        'X-GA-Cookie': gaUserId
    })
}).then(function (res) { return res.json() })
    .then(function (res) {
        //res["recommendations"] -> array of the ids of the recommended items with their recommendation score sorted in descending order
        handler(res["recommendations"])

    })
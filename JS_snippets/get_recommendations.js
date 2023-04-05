var gaUserId = document.cookie.match(/_ga=(.+?);/)[1].split('.').slice(-2).join(".")
fetch("https://m.sevc.link/recommendations", {
    method: "POST",
    body: JSON.stringify({
        'X-GA-Cookie': gaUserId
    })
}).then(function (res) { return res.json() })
    .then(function (res) {
        res["recommendations"].forEach(function (item) {
            console.log(item)
            //handler(item)
        })
    })
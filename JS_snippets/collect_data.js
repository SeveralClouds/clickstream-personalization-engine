var url = window.location.href

var itemId = url.replace(/^https?:\/\//i, '');
var gaUserId = document.cookie.match(/_ga=(.+?);/)[1].split('.').slice(-2).join(".")

var host = "https://m.sevc.link"

fetch(host + "/collect", {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        "ItemId": itemId,
        "X-GA-Cookie": gaUserId
    })
})
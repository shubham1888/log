function timeSince(date) {
    date = new Date(Date.now() - date);
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}
var aDay = 287879;
console.log(timeSince("2022-12-17T14:23:59.580Z"));
// console.log(timeSince(new Date(Date.now() - aDay * 2)));
// 1,671,285,155,336
console.log(new Date(Date.now()))
// console.log(Date.now())
// console.log(new Date(Date.now())-1671283602945)
// console.log(new Date(Date.now()).toLocaleString())
// console.log(new Date(Date.now())-1671285660768)
console.log(typeof "2022-02-19")
console.log("2022-02-19".toUpperCase())

const { tokenExpSec, tokenExpMin, tokenExpHours } = require('../config/config').session;

module.exports = (() => {
    let time = new Date();
    if (tokenExpSec) {
        time.setSeconds(time.getSeconds() + tokenExpSec);
    }
    if (tokenExpMin) {
        time.setMinutes(time.getMinutes() + tokenExpMin);
    }
    if (tokenExpHours) {
        time.setHours(time.getHours() + tokenExpHours);
    }
    return time;
});
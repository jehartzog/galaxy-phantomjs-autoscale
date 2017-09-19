function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var phantomjs = require('phantomjs-prebuilt');
var webdriverio = require('webdriverio');
var wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } };

var fs = require("fs");

var args = require('../auth-info.json');

var LOADING_TIMEOUT = 3000;

phantomjs.run('--webdriver=4444').then((() => {
    var _ref = _asyncToGenerator(function* (program) {
        console.log('Starting run');

        webdriverio.remote(wdOpts).init().url('https://galaxy.meteor.com/app/new.skoolerstutoring.com')

        // .reload()
        // .setValue('[name="username"]', args.galaxyUsername)
        // .setValue('[name="password"]', args.galaxyPassword)
        // .click('form button[type="submit"]')
        .pause(LOADING_TIMEOUT)
        // The below doesn't work since Galaxy sets opacity to 0 for loaded spinner. Need
        // custom function to handle
        // .waitForVisible('div.spinner-wheel', LOADING_TIMEOUT, true)
        .getText("div.cardinal-name=Connections").then(function (text) {
            console.log(text);
        }).getTitle().then(function (title) {
            console.log(title);
            program.kill();
        }).catch(function (err) {
            console.error(err);
            program.kill();
        });
    });

    return function (_x) {
        return _ref.apply(this, arguments);
    };
})());
var phantomjs = require('phantomjs-prebuilt')
var webdriverio = require('webdriverio')
var wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }

var fs = require("fs");

var args = require('../auth-info.json');

var LOADING_TIMEOUT = 3000

phantomjs.run('--webdriver=4444').then(async function (program) {
    console.log('Starting run');

    webdriverio.remote(wdOpts).init()
        .url('https://galaxy.meteor.com/app/new.skoolerstutoring.com')

        // .reload()
        // .setValue('[name="username"]', args.galaxyUsername)
        // .setValue('[name="password"]', args.galaxyPassword)
        // .click('form button[type="submit"]')
        .pause(LOADING_TIMEOUT)
        // The below doesn't work since Galaxy sets opacity to 0 for loaded spinner. Need
        // custom function to handle
        // .waitForVisible('div.spinner-wheel', LOADING_TIMEOUT, true)
        .getText("div.cardinal-name=Connections").then(text => {
            console.log(text);
        })
        .getTitle()
        .then(title => {
            console.log(title)
            program.kill()
        })
        .catch(err => {
            console.error(err)
            program.kill()
        })
})

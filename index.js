var phantomjs = require('phantomjs-prebuilt')
var webdriverio = require('webdriverio')
var wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }

var args = require('./auth-info.json');

var LOADING_TIMEOUT = 2000

phantomjs.run('--webdriver=4444').then(async program => {
    console.log('Starting run');

    // For reason using await on this doesn't work, so we just pause (ugh)
    const browser = webdriverio.remote(wdOpts)
        .init()
        .url('https://galaxy.meteor.com/app/new.skoolerstutoring.com')
    await browser.pause(LOADING_TIMEOUT);

    // .reload()
    // .setValue('[name="username"]', args.galaxyUsername)
    // .setValue('[name="password"]', args.galaxyPassword)
    // .click('form button[type="submit"]')
    // .pause(LOADING_TIMEOUT)
    // The below doesn't work since Galaxy sets opacity to 0 for loaded spinner. Need
    // custom function to handle
    // .waitForVisible('div.spinner-wheel', LOADING_TIMEOUT, true)
    const text = await browser.getText("div.cardinal-name=Connections");

    console.log('Title:', await browser.getTitle());
})

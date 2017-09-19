var phantomjs = require('phantomjs-prebuilt')
var webdriverio = require('webdriverio')
var wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }

var args = require('./auth-info.json');

var LOADING_TIMEOUT = 3000

const script = async () => {

};

phantomjs.run('--webdriver=4444').then(async program => {
    console.log('Starting run');

    let browser;
    browser = await webdriverio.remote(wdOpts).init();
    console.log(browser);
    const how = await browser.url('https://galaxy.meteor.com/app/new.skoolerstutoring.com').then(() => console.log('how'))
    console.log('meow', how);
    await browser.pause(1000);
    console.log('meow');

    // .reload()
    // .setValue('[name="username"]', args.galaxyUsername)
    // .setValue('[name="password"]', args.galaxyPassword)
    // .click('form button[type="submit"]')
    // .pause(LOADING_TIMEOUT)
    // The below doesn't work since Galaxy sets opacity to 0 for loaded spinner. Need
    // custom function to handle
    // .waitForVisible('div.spinner-wheel', LOADING_TIMEOUT, true)
    // .getText("div.cardinal-name=Connections").then(text => {
    //     console.log(text);
    // })
    // .getTitle()
    // .then(title => {
    //     console.log(title)
    //     program.kill()
    // })
    // .catch(err => {
    //     console.error(err)
    //     program.kill()
    // })
})

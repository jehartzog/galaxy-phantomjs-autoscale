// Created by J. Eric Hartzog on 7/19/17

var phantomjs = require('phantomjs-prebuilt')
var webdriverio = require('webdriverio')
var wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }

var scrapeInfo = require('./scrape-info');

var args = require('./auth-info.json');

var LOADING_TIMEOUT = 2000

phantomjs.run('--webdriver=4444').then(async program => {
    console.log('Starting run');

    try {
        // For reason using await on this doesn't work, so we just pause (ugh)
        const browser = webdriverio.remote(wdOpts)
            .init()
            .url('https://galaxy.meteor.com/app/new.skoolerstutoring.com');
        await browser.pause(LOADING_TIMEOUT);

        console.log('Browser loaded');

        // .reload()
        // await browser.setValue('[name="username"]', args.galaxyUsername)
        // .setValue('[name="password"]', args.galaxyPassword)
        // .click('form button[type="submit"]')

        // Wait till no more spinners, doesn't yet work
        // const loading = async () => {
        //     const spinners = await browser.getCssProperty('div.spinner-wheel', 'opacity');
        //     console.log(spinners);
        //     return spinners.reduce((acc, cur) => {
        //         return acc || cur.value !== 0;
        //     }, false);
        // };

        // while (await loading()) {
        //     console.log('Still loading, pausing...');
        //     await browser.pause(3000);
        // }

        const info = await scrapeInfo(browser);

        console.log(info);

        // await browser.click('button.cardinal-action.increment');
        // await browser.click('button.cardinal-action.decrement');

        console.log('Title:', await browser.getTitle());

    } catch (err) {
        console.error(err);
    }
    program.kill();
})

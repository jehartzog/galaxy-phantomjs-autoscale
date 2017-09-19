// Created by J. Eric Hartzog on 7/19/17

const phantomjs = require('phantomjs-prebuilt')
const webdriverio = require('webdriverio')
const wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }

const scrapeInfo = require('./scrape-info');
const scalingLogic = require('./scaling-logic');

const args = require('./auth-info.json');

const LOADING_TIMEOUT_MS = 2000
const SCALING_CLICK_TIMEOUT_MS = 3000;

phantomjs.run('--webdriver=4444').then(async program => {
    console.log('Starting run');

    try {
        // For reason using await on this doesn't work, so we just pause (ugh)
        const browser = webdriverio.remote(wdOpts)
            .init()
            .url('https://galaxy.meteor.com/app/new.skoolerstutoring.com');
        await browser.pause(LOADING_TIMEOUT_MS);

        console.log('Browser loaded');

        try {
            await browser.setValue('[name="username"]', args.galaxyUsername)
            await browser.setValue('[name="password"]', args.galaxyPassword)
            await browser.click('form button[type="submit"]')
        } catch (err) {
            console.log('Error trying to log in, most likely already logged in');
        }

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

        console.log('Current stats:', info);

        const scaleAction = scalingLogic(info);

        if (scaleAction > 0) {
            await browser.executeAsync(function (done) {
                eval("$('button.cardinal-action.increment').click()");
                setTimeout(function () {
                    done();
                }, SCALING_CLICK_TIMEOUT_MS);
            });
            console.log('Completed scaling up');
        }

        if (scaleAction < 0) {
            await browser.executeAsync(function (done) {
                eval("$('button.cardinal-action.decrement').click()");
                setTimeout(function () {
                    done();
                }, SCALING_CLICK_TIMEOUT_MS);
            });
            console.log('Completed scaling down');
        }
    } catch (err) {
        console.error(err);
    }

    console.log('Run complete');
    program.kill();
})

// Created by J. Eric Hartzog on 7/19/17

const phantomjs = require('phantomjs-prebuilt')
const webdriverio = require('webdriverio')
const wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }

const scrapeInfo = require('./scrape-info');
const scalingLogic = require('./scaling-logic');

const args = require('./auth-info.json');

phantomjs.run('--webdriver=4444').then(async program => {
    console.log('Starting run');

    try {
        // For reason using await on this doesn't work, so we just pause (ugh)
        const browser = webdriverio.remote(wdOpts)
            .init()
            .url('https://galaxy.meteor.com/app/new.skoolerstutoring.com');

        await browser.pause(5000);

        console.log('Browser loaded');

        await browser.executeAsync(function (done) {
            eval("window.localStorage.clear()");
            setTimeout(function () {
                done();
            }, 5000);
        });

        console.log('Cleared local storage');

        try {
            await browser.setValue('[name="username"]', args.galaxyUsername)
            await browser.setValue('[name="password"]', args.galaxyPassword)
            await browser.click('form button[type="submit"]')
        } catch (err) {
            console.log(`Error trying to log in ${err}`);
        }

        await browser.pause(5000);

        // Wait till no more spinners
        const loading = async () => {
            const spinners = await browser.getCssProperty('div.loading-spinner', 'opacity');
            return spinners.reduce((acc, cur) => {
                return acc || cur.value !== 0;
            }, false);
        };

        while (await loading()) {
            console.log('Still loading, pausing...');
            await browser.pause(3000);
        }

        const info = await scrapeInfo(browser);

        console.log('Current stats:', info);

        const scaleAction = scalingLogic(info);

        if (scaleAction > 0) {
            await browser.executeAsync(function (done) {
                eval("$('button.cardinal-action.increment').click()");
                setTimeout(function () {
                    done();
                }, 5000);
            });
            console.log('Completed scaling up');
        }

        if (scaleAction < 0) {
            await browser.executeAsync(function (done) {
                eval("$('button.cardinal-action.decrement').click()");
                setTimeout(function () {
                    done();
                }, 5000);
            });
            console.log('Completed scaling down');
        }
    } catch (err) {
        console.error(err);
    }

    console.log('Run complete');
    program.kill();
})

var phantomjs = require('phantomjs-prebuilt')
var webdriverio = require('webdriverio')
var wdOpts = { desiredCapabilities: { browserName: 'phantomjs' } }

phantomjs.run('--webdriver=4444').then(program => {
    webdriverio.remote(wdOpts).init()
        .url('https://developer.mozilla.org/en-US/')
        .getTitle().then(title => {
            console.log(title) // 'Mozilla Developer Network' 
            program.kill() // quits PhantomJS 
        })
})
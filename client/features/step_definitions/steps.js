const { After, Given, Then, When } = require("cucumber")
const { assert, expect } = require('chai')
const spawn = require("child_process").spawn
const { Builder, By, until } = require('selenium-webdriver')
const { Options } = require('selenium-webdriver/chrome')

After(async function () {
    if (this.circuitFinderService) {
      this.circuitFinderService.kill()
    }

    if (this.driver) {
        await this.driver.quit()
        this.driver = null
    }
})

function startCircuitFinderService(done) {
    this.circuitFinderService = spawn('node', ['test_service.js'])
    this.circuitFinderService.on('error', (err) => {
      assert.fail('The Circuit Finder service failed to start: ', err)
    })
    this.circuitFinderService.stdout.on('data', (data) => {
        if (data.indexOf('Test service running at http://localhost') >= 0) {
          done()
        }
    })
}

Given('the power is on', startCircuitFinderService)

When('I load the page', async function () {
    if (!this.driver) {
        let builder = new Builder().forBrowser('chrome')
        if (process.env.CI) {
            let options = new Options()
            options.headless()
            options.addArguments('--disable-dev-shm-usage')
            options.addArguments('--disable-extensions')
            options.addArguments('--disable-gpu')
            options.addArguments('--no-sandbox')
            builder.setChromeOptions(options)
        }
        this.driver = await builder.build()
    }
    
    await this.driver.get(`http://localhost:3000`)
})

When('the power is turned off', function () {
    if (this.circuitFinderService) {
        this.circuitFinderService.kill()
    }
})

When('the power is turned back on', startCircuitFinderService)

Then('the page shows the power is on', async function () {
    const state = await this.driver.findElement(By.id('state'))
    await this.driver.wait(until.elementTextIs(state, 'ON'))

    const body = await this.driver.findElement(By.tagName('body'))
    expect(await body.getAttribute('class')).to.equal('connected')
})

Then('the page shows the power is off', async function () {
    const state = await this.driver.findElement(By.id('state'))
    await this.driver.wait(until.elementTextIs(state, 'OFF'))
  
    const body = await this.driver.findElement(By.tagName('body'))
    expect(await body.getAttribute('class')).to.equal('')
})

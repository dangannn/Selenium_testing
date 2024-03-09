const assert = require('assert');
const {Builder, Browser, By, until} = require('selenium-webdriver');
let driver = new Builder().forBrowser(Browser.CHROME).build();
let total = 5;
let remaining = 5;

lambdaTest();


async function lambdaTest() {

    try {
        await driver.get("https://lambdatest.github.io/sample-todo-app/");
        await driver.manage().window().maximize();
        await driver.wait(until.elementLocated(By.css('h2')), 5000, 'Заголовок не появился')

        let title = await driver.findElement(By.css('h2'));
        let isTitleDisplayed = await title.isDisplayed();
        assert.ok(isTitleDisplayed)

        // в иллюстративных целях
        await driver.sleep(1000);

        for (let i = 1; i <= total; i++) {
            let remainingElem = await driver.findElement(By.xpath("//span[@class='ng-binding']"));
            let text = await remainingElem.getText();

            let expectedText = `${remaining} of ${total} remaining`;
            assert.equal(text, expectedText);

            let item = await driver.findElement(By.xpath(`//input[@name='li${i}']/following-sibling::span`))

            let itemClass = await item.getAttribute("class");

            assert.equal(itemClass, "done-false");

            await driver.findElement(By.name("li" + i)).click();

            remaining--;

            // в иллюстративных целях
            await driver.sleep(1000);

            itemClass = await item.getAttribute("class");

            assert.equal(itemClass, "done-true");
        }

        await driver.findElement(By.id("sampletodotext")).sendKeys("New Item");
        await driver.sleep(1000);
        await driver.findElement(By.id("addbutton")).click();

        let item = await driver.findElement(By.xpath("//input[@name='li6']/following-sibling::span"));
        let itemText = await item.getText();
        let itemClass = await item.getAttribute("class");

        assert.equal(itemText, "New Item");
        assert.equal(itemClass, "done-false");

        await driver.sleep(1000);
        await driver.findElement(By.name("li6")).click();

        itemClass = await item.getAttribute("class");
        assert.equal(itemClass, "done-true");

        await driver.sleep(3000);
    } catch (err) {

        driver.takeScreenshot().then(function (image) {
            require('fs').writeFileSync('screenshot_error.png', image, 'base64')
        });

        console.error('Тест упал по причине ошибки: %s', err);
    } finally {
        await driver.quit();
    }
}
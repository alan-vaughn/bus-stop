const puppeteer = require('puppeteer');
require('./cleaned.js');

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({
        width: 300,
        height: 800,
        deviceScaleFactor: 1,
    });


    await asyncForEach(allStops, async (stop) => {
        await page.goto(`http://127.0.0.1:8080?stop_id=${stop.stop_id}`);
        await page.waitFor(150);
        await page.screenshot({path: `output/${stop.stop_id}.png`});
    })

    await browser.close();
})();

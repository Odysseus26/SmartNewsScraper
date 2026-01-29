import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from 'fs'

function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            reject(new Error("Timeout"));
        }, ms);

        promise
            .then(value => {
                clearTimeout(timer);
                resolve(value);
            })
            .catch(err => {
                clearTimeout(timer);
                reject(err);
            });
    });
}




function readSite(url, fetchPort, callback, passAlong) {
    puppeteer.use(StealthPlugin());

    async function main(url, keyword) {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        const page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/126 Safari/537.36"
        );

        await page.setViewport({ width: 1366, height: 768 });
        await page.goto(url, { waitUntil: "domcontentloaded" });

        await page.waitForSelector(keyword, { timeout: 15000 });

        const headlines = await page.$$eval(keyword, els =>
            els.map(el => ({
                inner: el.innerText.trim(),
                url: el.closest("a")?.href || ""
            }))
        );

        await browser.close();
        return headlines;
    }

    const scrape = withTimeout(main(url, fetchPort), 20000);  // 20 sec timeout

    scrape
        .then(data => callback(data, passAlong))
        .catch(err => {
            console.log(`❌ Skipped: ${url} → ${err.message}`);
            callback(null, passAlong);  // ⬅ report failure to callback
        });
}


let readJSON = (pathway) => JSON.parse(fs.readFileSync(pathway, "utf8"));

function writeJSON(pathway,object){
    object = JSON.stringify(object)
    fs.writeFileSync(pathway,object,(err)=>console.log(err));
}

function blankOut(pathway){
    let toClean = readJSON(pathway)
    for(let keys in toClean) toClean[keys] = "";
    writeJSON(pathway,toClean);
}

function modelInternal(content,format = false){
    let modelReturn = {
        model:'llama3.1',
        messages: [{ role: 'user', content: content }]
    }
    if(format) modelReturn.format = "json";
    return modelReturn;
}

const readDigits = {
    "readSite":readSite,
    "readJSON":readJSON,
    "writeJSON":writeJSON,
    "blankOut":blankOut,
    "modelInternal":modelInternal
}

export default readDigits;
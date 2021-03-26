const puppeteer = require("puppeteer");
const fs = require("fs");
const baseUrl = "https://www.airbnb.co.uk/rooms/";
const listings = ["33571268", "33090114", "40558945"];

async function app() {
    console.log("Starting scrape");

    let scrapedListings = [];

    for await (listing of listings) {
        const data = await getListingData(listing);
        data["id"] = listing;
        console.log(data);
        scrapedListings.push(data);
    }

    console.log("Scrape complete, will now write to file");

    try {
        fs.writeFile(
            "scrapedListings.json",
            JSON.stringify(scrapedListings),
            "utf8",
            function (err) {
                if (err) throw err;
                console.log("File complete");
            }
        );
    } catch (err) {
        console.log(`Error writing to file ${err}`);
    }
}

async function waitForSelectors(page) {
    try {
        await page.waitForSelector("._mbmcsn", { timeout: 3000 });
        await page.waitForSelector("._xcsyj0", { timeout: 3000 });
        await page.waitForSelector("._tqmy57 span:last-child", {
            timeout: 3000,
        });
        await page.waitForSelector("._7ts20mk", { timeout: 3000 });
    } catch (e) {
        console.log(`Error occurred waiting on selectors: ${e}`);
    }
}

async function getListingData(listing) {
    const listingUrl = baseUrl + listing;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(listingUrl);
    await waitForSelectors(page);

    const listingData = await page.evaluate(() => {
        let data = {};

        try {
            let listingName = document.querySelector("._mbmcsn").innerText;
            data["listingName"] = listingName || null;
        } catch (e) {
            console.log(`Error getting listingName: ${e}`);
        }

        try {
            let typeQuery = document.querySelector("._xcsyj0").innerText;
            let listingType = typeQuery
                .substr(0, typeQuery.indexOf("hosted"))
                .trim();

            data["listingType"] = listingType || null;
        } catch (e) {
            console.log(`Error getting listingType: ${e}`);
        }

        try {
            let numberOfBathrooms = parseInt(
                document
                    .querySelector("._tqmy57 span:last-child")
                    .textContent.split(" ")[0]
            );
            data["numberOfBathrooms"] = numberOfBathrooms || null;
        } catch (e) {
            console.log(`Error getting numberOfBathrooms: ${e}`);
        }

        try {
            let numberOfBedrooms = document.querySelector("._7ts20mk").children
                .length;
            data["numberOfBedrooms"] = numberOfBedrooms || null;
        } catch (e) {
            console.log(`Error getting numberOfBedrooms: ${e}`);
        }

        return data;
    });

    await browser.close();

    return listingData;
}

app();

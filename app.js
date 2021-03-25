const puppeteer = require("puppeteer");
const baseUrl = "https://www.airbnb.co.uk/rooms/";
const listings = ["33571268", "33090114", "40558945"];

async function app() {
    for await (listing of listings) {
        const data = await getListingData(listing);
        console.log({ data });
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
        console.log(e + "Error occurred waiting on selectors");
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
            let propertyName = document.querySelector("._mbmcsn").innerText;
            data["propertyName"] = propertyName || null;
        } catch (e) {
            console.log(`Error getting propertyName: ${e} `);
            return;
        }

        try {
            let typeQuery = document.querySelector("._xcsyj0").innerText;
            let propertyType = typeQuery
                .substr(0, typeQuery.indexOf("hosted"))
                .trim();

            data["propertyType"] = propertyType || null;
        } catch (e) {
            console.log(`Error getting propertyType: ${e} `);
            return;
        }

        try {
            let numberOfBathrooms = parseInt(
                document
                    .querySelector("._tqmy57 span:last-child")
                    .textContent.split(" ")[0]
            );
            data["numberOfBathrooms"] = numberOfBathrooms || null;
        } catch (e) {
            console.log(`Error getting numberOfBathrooms: ${e} `);
            return;
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

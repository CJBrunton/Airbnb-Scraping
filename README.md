# TravelNest-Exercise

A script written in JS and using puppeteer that will scrape Airbnb listings to return name, type,number of bedrooms and number of bathrooms.

Steps to run the script and verify the output:

1. Pull down the repo and run npm install
2. Run node app.js
3. Check the console for the scraping progress of the listings.
4. Open the generated scrapedListing.json file to view the scraped data.

# What I would still like to do

-   Further research into the best optimisation of scraping with JS.

-   Optimisation of using puppeteer, the current wait for selectors seems like it would take up a lot of time and I feel there must be another way to do this.

-   Improve the DOM manipulation to be more robust and reliable when pulling the information.

-   Retrieve the list of amenities that have been asked for, this has currently been left due to the time constraint of a few hours. I could pull all amenities but not idetify which were unavailable, I made the decision that not listing amenties would be better than listing incorrect/unavailable ones at this time.

-   Add some tests around the script to improve on the timeout and try/catch error handling.

-   As an output in a full project you could send the scraped data to an api endpoint to insert to a db.

-   Add linting and editor config to the file, prettier has been used locally.

const { BeforeAll, AfterAll, Given, When, Then, setDefaultTimeout } = require('cucumber');
const assert = require('assert');
const { chromium } = require('leanpro.web');

setDefaultTimeout(30 * 1000);

let browser, context;
let page;

BeforeAll(async function () {
    browser = await chromium.launch({
        headless: false
    });
    context = await browser.newContext();
});

AfterAll(async function () {
    // clear and close
    // ---------------------
    await context.close();
    await browser.close();
});


// Navigate to https://google.co.nz
Given("goto {string}", async function (searchEngine) {
    page = await context.newPage();
    await page.goto(searchEngine);
    await Promise.all([
        page.waitForNavigation(/*{ url: 'https://www.google.com/' }*/),
        page.click('text=English')
    ]);
    
});

//2 a) Search by “Maui” should have a link to ‘maui - rentals.com’ in the returns results
//3. a) Search by “Britz” should have a link to ‘britz.com’ in the returns results
When("input for search{string}", async function (skeyword) {

    await page.click('[aria-label="Search"]');//EN version

    await page.fill('[aria-label="Search"]', skeyword);//EN version

    await Promise.all([
        page.waitForNavigation(/*{ url: 'https://www.google.com/search?q=' }*/),
        page.click('text=Google Search')
        //page.click(':nth-match(:text("Google Search"), 2)')
    ]);

});
//2 a) Search by “Maui” should have a link to ‘maui - rentals.com’ in the returns results
//3. a) Search by “Brtiz” should have a link to ‘britz.com’ in the returns results
Then("should have a link to {string} in the returns results", async function (sResult) {

    let urlText1 = "text=";
    let urlText = urlText1.concat(sResult);

    await page.click(urlText);
    assert.notStrictEqual(page.url(), sResult);
});

let npage;
let desCountry1;

Given("in {string} select {string}", async function (weburl, desCountry) {

    npage = await context.newPage();
    await npage.goto(weburl);

    desCountry1 = desCountry;

    //await npage.click('div:has-text("Choose your destination")');
    await npage.click('text=Choose your destinationNew ZealandAustraliaChoose your destinationNew ZealandAus >> div');
    if ((desCountry.includes("Zealand")) || (desCountry.includes("zealand"))) {
        // await npage.click('li.has-text(""=Choose your destinationNew ZealandAustraliaChoose your destinationNew ZealandAus >> li"")');
        await npage.click('li[data-raw-value="nz"]:has-text("New Zealand")');

    }
    else if ((desCountry.includes("Aus")) || (desCountry.includes("aus"))) {
        // await npage.click('text=Choose your destinationNew ZealandAustraliaChoose your destinationNew ZealandAus >> :nth-match(li, 2)');
        await npage.click('li[data-raw-value="au"]:has-text("Australia")');
    }
});
Then("select {int} {int} {int} {int}", async function (upMonth, upDay, offMonth, offDay) {

    var upMonth, upDate;
    this.upMonth = upMonth
    this.upDay = upDate

    let date = new Date();
    let nowMonthNum = date.getMonth() + 1;
    let nowDate = date.getDate();

    await npage.click('button:has-text("Pick Up Date")');

    //In currest month, the prev button should be enable 
    let bPrevMon;
    bPrevMon = await npage.isEnabled('text=Prev');
    assert.equal(true, bPrevMon);

    // Click pick up date
    let monthPickSpan = upMonth - nowMonthNum;
    for (let i = 0; i < monthPickSpan; i++) {
        await npage.click('text=Next');
    }

    var textPickDay = "text=" + upDay;
    await npage.click(textPickDay);

    // Click pick off date
    await npage.click('button:has-text("Drop Off Date")');
    let monthOffSpan = offMonth - upMonth;
    for (let i = 0; i < monthOffSpan; i++) {
        await npage.click('text=Next');
    }
    let textOffDay = "text=" + offDay;
    await npage.click(textOffDay);

});

Then("select {string} {string}", async function (pCity, offCity) {

    // select Pick Up City
    let textpCity = 'li:has-text("' + pCity + '")';
    // select Drop Off City
    let textOffCity = ':nth-match(li:has-text("' + offCity + '"), 2)';

    if (desCountry1.toLowerCase() == "new zealand") {
        // pick Up City
        await npage.click('text=Pick Up Location AucklandChristchurchQueenstown Pick Up LocationAucklandChristch >> div');
        await npage.click(textpCity);
        // select Drop Off City
        await npage.click('text=Drop Off Location AucklandChristchurchQueenstown Drop Off LocationAucklandChrist >> div');
        await npage.click(textOffCity);
    }
    else if (desCountry1.toLowerCase() == "australia") {

        // pick Up City
        await npage.click('#form_main >> :nth-match(:text("Pick Up Location"), 3)');
        await npage.click(textpCity);
        // select Drop Off City
        await npage.click('#form_main >> :nth-match(:text("Drop Off Location"), 3)');
        await npage.click(textOffCity);
    }

});

Then("in {string} select {int} {int} {string}", async function (weburl, adultNum, kidNum, driverL) {

    // Click button:has-text("Passengers")
    await npage.click('button:has-text("Passengers")');

    // select number of adults
    await npage.click('#form_main div:has-text("Adults 1234561123456")');
    let textAdult = '#form_main li:has-text("' + adultNum + '")';
    await npage.click(textAdult);

    // select number of kis
    await npage.click('#form_main div:has-text("Children 0123450012345")');
    let textKid = '#form_main >> :nth-match(li:has-text("' + kidNum + '"), 2)';
    await npage.click(textKid);

    await npage.click('#form_licence__main_chosen >> text=Drivers Licence');
    if (driverL.toLowerCase() == "new zealand" || driverL.toLowerCase() == "australia") {
        let textDri = '#form_licence__main_chosen >> text=' + driverL;
        await npage.click(textDri);
    }
    else {
        let textDri = 'li:has-text("' + driverL + '")';
        //console.log("textDri is :", textDri);
        await npage.click(textDri);
    }
});

Then("input promotion {string}", async function (proCode) {

    await npage.click('[placeholder="Promo Code"]');
    await npage.fill('[placeholder="Promo Code"]', proCode);

});


Then("in {string}do search should get {int}", async function (weburl, resultNum) {

    let sloganText;
    let logoImage;

    if (weburl.includes("maui")) {
        await Promise.all([
            npage.waitForNavigation(/*{ url: 'https://booking.maui-rentals.com/search?' }*/),
            npage.click('button:has-text("Search")')
        ]);
        sloganText = "Check out our fully self contained premium maui motorhome range.";
        logoImage = "m-logo.jpg";
    }
    else if (weburl.includes("britz")) {
        await Promise.all([
            npage.waitForNavigation(/*{ url: 'https://booking.britz.com/search?' }*/),
            npage.click('button:has-text("Search")')
        ]);
        sloganText = "Check out our wide range of affordable 2WD and 4WD campers.";
        logoImage = "b-logo.jpg";
    }

    // check result
    await npage.waitForSelector(".row.thl-sub-section-heading-brand");


    await npage.context('Sorry, we haven\'t found any campervans for your search dates or locations. ');


    // should return results for 4 brands
    let brands = await npage.$$(".row.thl-sub-section-heading-brand");
    assert.notEqual(brands, null);
    //assert.equal(brands.length, 4);

    // make sure the first brand matches the web site being visited
    let logoSel = 'div[style="background-image:url(images/' + logoImage + ');"]';
    let logo = await brands[0].$(logoSel);
    assert.notEqual(logo, null);

    // the number of results for this brand should be 'resultNum'
    let brandResultText = 'text=' + resultNum + " Results";
    let brandResult = await brands[0].$(brandResultText);
    assert.notEqual(brandResult, null)

});

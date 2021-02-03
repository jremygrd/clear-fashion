/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');

const mudjeans = require('./sources/MudJeans');

const adresseParis = require('./sources/adresseparis')

  //async function sandbox (eshop = 'https://www.dedicatedbrand.com/en/men/news') {
  //async function sandbox (eshop = 'https://mudjeans.eu/collections/men') {
  async function sandbox (eshop = 'https://adresse.paris/584-chemises') {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);
    const products = await adresseParis.scrape(eshop);

    console.log(products);
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, eshop] = process.argv;

sandbox(eshop);

/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrandold');
const loom = require('./sources/loom');
const adresseparis = require('./sources/adresseparis');
const mudjeans = require('./sources/mudjeans');
const db = require('./db');

async function sandbox () {
  try {
    let products = [];
    let pages = [
      'https://www.dedicatedbrand.com/en/men/basics',
    ];

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with for...of`);

    // Way 1 with for of: we scrape page by page
    for (let page of pages) {
      console.log(`🕵️‍♀️  scraping ${page}`);

      let results = await dedicatedbrand.scrape(page);

      console.log(`👕 ${results.length} products found`);

      products.push(results);
    }

    pages = [
      'https://adresse.paris/630-toute-la-collection?id_category=630&n=109']

      for (let page of pages) {
       let results = await adresseparis.scrape(page);
       console.log(`👕 ${results.length} products found`);
       products.push(results);
      }

      pages = [
        'https://mudjeans.eu/collections/men']
  
        for (let page of pages) {
         let results = await mudjeans.scrape(page);
         console.log(`👕 ${results.length} products found`);
         products.push(results);
        }
    

    pages = [
      'https://www.loom.fr/collections/hauts',
      'https://www.loom.fr/collections/bas',
      'https://www.loom.fr/collections/sous-vetements'
    ];

    console.log('\n');

    console.log(`🕵️‍♀️  browsing ${pages.length} pages with Promise.all`);

    const promises = pages.map(loom.scrape);
    const results = await Promise.all(promises);

    console.log(`👕 ${results.length} results of promises found`);
    console.log(`👕 ${results.flat().length} products found`);

    products.push(results.flat());
    products = products.flat();

    console.log('\n');

    console.log(`👕 ${products.length} total of products found`);

    console.log('\n');

    const result = await db.insert(products);

    console.log(`💽  ${result.insertedCount} inserted products`);

    console.log('\n');

    // console.log('💽  Find Loom products only');

    // const loomOnly = await db.find({'brand': 'loom'});

    //sconsole.log(loomOnly);

    db.close();
  } catch (e) {
    console.error(e);
  }
}

sandbox();

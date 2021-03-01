/* eslint-disable no-console, no-process-exit */
const dedicatedbrand = require('./sources/dedicatedbrand');
const mudjeans = require('./sources/MudJeans');
const adresseParis = require('./sources/adresseparis')
const fs = require('fs');

let all = [{'importfunc':dedicatedbrand,'src':'https://www.dedicatedbrand.com/en/loadfilter?category=men%2Fsweat'},
            {'importfunc':mudjeans,'src':'https://mudjeans.eu/collections/men'},
            {'importfunc':adresseParis,'src':'https://adresse.paris/630-toute-la-collection?id_category=630&n=109'}
]

let allpr = []

  async function sandbox (importfunc,eshop) {
  try {
    console.log(`🕵️‍♀️  browsing ${eshop} source`);
    const products = await importfunc.scrape(eshop);
    console.log(products.length);
    allpr.push(products)
    console.log('done');
    if(eshop == all[all.length-1].src){
      let data = JSON.stringify(allpr);
      fs.writeFileSync('products.json', data);
      process.exit(0);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  

}

const [,, eshop] = process.argv;


getAll()

async function getAll(){
  allpr = []
  all.forEach(element => {
  sandbox(element.importfunc,element.src)
  });
}
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {

  res = []
  f = 'https://www.dedicatedbrand.com/'

  data.products.forEach(element => {
    
    if(element.id && element.canonicalUri.slice(0,4)=='men/'){
      
      if(res.hasOwnProperty(element.id)){

      }else{

      res.push({'name':element.name, 
        'id' : element.id,
        'price' :element.price.priceAsNumber, 
        'newProduct':element.price.newProduct,
        'link':f.concat(element.canonicalUri),
        'showAsOnSale':element.price.showAsOnSale,
        'photo':element.image
      }
      )
    }
  }
    
  });
  return res;
}

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async() => {
  const response = await axios("https://www.dedicatedbrand.com/en/loadfilter?category=men%2Fsweat");
  const {data, status} = response;
console.log("scraping dedicated")
  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};
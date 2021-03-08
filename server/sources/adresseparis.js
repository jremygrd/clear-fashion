const axios = require('axios');
const cheerio = require('cheerio');
const {'v5': uuidv5} = require('uuid');
/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('.product-container')
    .map((i, element) => {
      const name = $(element)
        .find('.product-name-container.versionmob')
        .text()
        .trim()
        .replace(/[\s\t]/g, ' ');
      const price = parseInt(
        $(element)
           .find('.price.product-price')
          .text().trim().replace(/[\s\t€]/g, ' ').trim());
      
      const link = 
      $(element).find('.product_img_link').attr('href');

      let photo = []
      photo.push($(element).find('.img_0').attr('data-original'));
      photo.push($(element).find('.img_1').attr('data-rollover'));
      let _id = uuidv5(link, uuidv5.URL);
      let brand = 'adresseparis'
      return {name, price,link,photo,_id,brand};

    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async () => {
  const response = await axios('https://adresse.paris/630-toute-la-collection?id_category=630&n=109');
  const {data, status} = response;
  console.log("scraping adresse paris")
  if (status >= 200 && status < 300) {
    return parse(data);
  }
  console.error(status);

  return null;
};


function create_UUID(){
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}
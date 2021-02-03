const axios = require('axios');
const cheerio = require('cheerio');

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


      const photo =  $(element).find('img').attr('data-original');


      return {name, price,link,photo};

    })
    .get();
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async url => {
  console.log(url)
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};

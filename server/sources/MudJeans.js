const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage e-shop
 * @param  {String} data - html response
 * @return {Array} products
 */
const parse = data => {
  const $ = cheerio.load(data);

  return $('div.product-link')
    .map((i, element) => {
      console.log(element);
      const name = $(element)
        // .find('h2.collection-page__title')
        .find('.product-title')
        .text()
        .trim()
        .replace(/\s/g, ' ');

      const price = 
      parseInt(
        $(element)
          .find('p.product-price')
          .text().replace(/[\nBuy€]/g, ' ').trim()
      )
      const f = 'https://mudjeans.eu/'
      const url = 
      $(element).find('a').attr('href');
      let link = f.concat(url)


      const photo =  $(element).find('img').attr('src');


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
  console.log(url);
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};

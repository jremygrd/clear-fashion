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
      const name = $(element)
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


      const photos =  $(element).find('img').attr('srcset');
      let photo = photos.split(",")

      photo2 = [];
      photo.forEach(element => {
        photo2.push(element.slice(0,-3))
      });
      photo = photo2;
      let id = create_UUID();
      let brand = 'MudJeans'

      return {name, price,link,photo,id,brand};
    })
    .get();
    
};

/**
 * Scrape all the products for a given url page
 * @param  {[type]}  url
 * @return {Array|null}
 */
module.exports.scrape = async() => {
  const response = await axios("https://mudjeans.eu/collections/men");
  console.log("scraping Mudjeans")
  const {data, status} = response;

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


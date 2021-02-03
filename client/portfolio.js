// Invoking strict mode https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode#invoking_strict_mode
'use strict';


// current products on the page
let currentProducts = [];
let currentPagination = {};
let currentBrandFilter = "";
let currentSort = "price-asc";
let reasonablePriceChecked = false;
let recentlyReleasedChecked = false;
let favoritesChecked = false;

// inititiqte selectors
const selectShow = document.querySelector('#show-select');
const selectPage = document.querySelector('#page-select');
const sectionProducts = document.querySelector('#products');


const spanNbNewProducts = document.querySelector('#NbNewProducts');
const spanP95 = document.querySelector('#P95');
const spanNbProducts = document.querySelector('#nbProducts');
const spanP50 = document.querySelector('#P50');
const spanP90 = document.querySelector('#P90');
const spanLastReleased = document.querySelector('#LastReleased');

const checkBox1 = document.querySelector('#reasonable-price');
const checkBox2 = document.querySelector('#recently-released');
const checkBox3 = document.querySelector('#favorites');

const selectBrands = document.querySelector('#brand-select');

const selectSort = document.querySelector('#sort-select');


/**
 * Set global value
 * @param {Array} result - products to display
 * @param {Object} meta - pagination meta info
 */
const setCurrentProducts = ({result, meta}) => {
  currentProducts = result;
  currentPagination = meta;
};

/**
 * Fetch products from api
 * @param  {Number}  [page=1] - current page to fetch
 * @param  {Number}  [size=12] - size of the page
 * @return {Object}
 */
const fetchProducts = async (page = 1, size = 12) => {
  try {
    const response = await fetch(
      `https://clear-fashion-api.vercel.app?page=${page}&size=${size}`
    );
    const body = await response.json();
    if (body.success !== true) {
      console.error(body);
      return {currentProducts, currentPagination};
    }

    return body.data;
  } catch (error) {
    console.error(error);
    return {currentProducts, currentPagination};
  }
};

/**
 * Render list of products
 * @param  {Array} products
 */
const renderProducts = products => {
  //console.log(currentSort);
  const fragment = document.createDocumentFragment();
  const div = document.createElement('div');

  
  if(selectBrands.selectedIndex!=0 && currentBrandFilter!=""){
    //console.log(brandNames[selectBrands.selectedIndex-1])
    products = products.filter(brand => brand.brand==brandNames[selectBrands.selectedIndex-1])
  }
  if(currentSort=="price-asc"){
    const sortByPrice = (a, b) => a.price - b.price;
    products = products.sort(sortByPrice);
  }

  if(currentSort=="price-desc"){
    const sortByPrice = (a, b) => a.price - b.price;
    products = products.sort(sortByPrice).reverse();
  }

  if(currentSort=='date-asc'){
    const sortByDate = (a, b) => a.date < b.date ? -1 : a.date === b.date ? 0 : 1;
    products = products.sort(sortByDate).reverse();
  }

  if(currentSort=='date-asc'){
    const sortByDate = (a, b) => a.date < b.date ? -1 : a.date === b.date ? 0 : 1;
    products = products.sort(sortByDate).reverse();
  }

  if(currentSort=='date-desc'){
    const sortByDate = (a, b) => a.date < b.date ? -1 : a.date === b.date ? 0 : 1;
    products = products.sort(sortByDate);
  }
  if(reasonablePriceChecked){
    products = products.filter(product =>
      product.price <= 50)
  }
  if(favoritesChecked){
    products = products.filter(product =>
      favorites.includes(product.uuid))
  }

  if(recentlyReleasedChecked){
    const today = Date.now();
    let newProducts = []
    products.forEach(product => {
      const date = new Date(product.released)
      const diffTime = Math.abs(today - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));   
      if(diffDays < 15){
        newProducts.push(product)
      }
    })
   products = newProducts
  }


  const template = products
    .map(product => {
      product.photo[0] != "h" ? product.photo = "https:".concat(product.photo):null;

      return `
      <div class="product" id=${product.uuid}>
        <img src=${product.photo}></img>
        <span>${product.brand}</span>
        <a href="${product.link}" id ="newTab">${product.name}</a>
        <span>${product.price}</span>
        <input type="checkbox" name="fav" onclick = "SetFav('${product.uuid}')" ` +isChecked(product.uuid) +`>
          <label for="Favorite"></label>
      </div>
    `;
    })
    .join('');

  div.innerHTML = template;
  fragment.appendChild(div);
  sectionProducts.innerHTML = '<h2>Products</h2>';
  sectionProducts.appendChild(fragment);

};

const isChecked = uuid => {

  if(favorites.includes(uuid)){
    return "checked"
  }

}

function SetFav(id){
  let alreadyFav = false

  favorites.forEach(uuid => {
    if(uuid == id){
      alreadyFav = true
    }
  })

  if(!alreadyFav){
    favorites.push(id)
  }else{
    favorites = favorites.filter(fav=>fav.uuid === id)
  }

  console.log(favorites)
}

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderPagination = pagination => {
  const {currentPage, pageCount} = pagination;
  const options = Array.from(
    {'length': pageCount},
    (value, index) => `<option value="${index + 1}">${index + 1}</option>`
  ).join('');
  selectPage.innerHTML = options;
  selectPage.selectedIndex = currentPage - 1;
};

/**
 * Render page selector
 * @param  {Object} pagination
 */
const renderIndicators = (pagination,products) => {
  const {count} = pagination;

  spanNbProducts.innerHTML = count;

  let newcount = 0;
  const today = Date.now();

  products.forEach(product => {
      const date = new Date(product.released)
      const diffTime = Math.abs(today - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));   
      if(diffDays < 15){
        newcount++;
      }})
  spanNbNewProducts.innerHTML = newcount;
  


    const threshold5 = 0.5*products.length; //126

    var P50 = 9999;
    while(products.filter(product => product.price > P50).length < threshold5){
      P50 = P50-1;
    }
    spanP50.innerHTML = P50;


  const threshold95 = 0.95*products.length; //126

    var p95 = 9999;
    while(products.filter(product => product.price > p95).length < threshold95){
      p95 = p95-1;
    }
  spanP95.innerHTML = p95;

  
  const threshold9 = 0.9*products.length; //126

    var p90 = 9999;
    while(products.filter(product => product.price > p90).length < threshold9){
      p90 = p90-1;
    }
  spanP90.innerHTML = p90;

  let lastReleased = new Date(products[0].released)
  products.forEach(product => {

    const date = new Date(product.released)
    //console.log(date);
    if(Math.abs(date) > Math.abs(lastReleased)){
      lastReleased = date;
    }})


  spanLastReleased.innerHTML = lastReleased;

};

const render = (products, pagination) => {
  renderProducts(products);
  renderPagination(pagination);
  renderIndicators(pagination,products);
  
};

/**
 * Declaration of all Listeners
 */

/**
 * Select the number of products to display
 * @type {[type]}
 */
selectShow.addEventListener('change', event => {
  //console.log(selectBrands.selectedIndex)
  fetchProducts(currentPagination.currentPage, parseInt(event.target.value))
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
    
    
});


/**
 * Select the pagination
 * @type {[type]}
 */
selectPage.addEventListener('change', event => {
  fetchProducts(parseInt(event.target.value),currentProducts.length)
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination));
});


/**
 * Select the brand filter
 * @type {[type]}
 */

selectBrands.addEventListener('change', function() {
  currentBrandFilter = this.value;
  render(currentProducts, currentPagination)
}, false);


selectSort.addEventListener('change', function() {
  currentSort = this.value;
  render(currentProducts, currentPagination)
}, false);

checkBox1.addEventListener('change', function() {
  reasonablePriceChecked = this.checked;
  render(currentProducts, currentPagination)
}, false);


checkBox2.addEventListener('change', function() {
  recentlyReleasedChecked = this.checked;
  render(currentProducts, currentPagination)
}, false);

checkBox3.addEventListener('change', function() {
  favoritesChecked = this.checked;
  render(currentProducts, currentPagination)
}, false);


const renderBrandFilter = () => {
  var options = `<option value="Tout">Tout</option>`
  brandNames.forEach(product => {
  options +=`<option value="${product}">${product}</option>`
  })
  selectBrands.innerHTML = options;
  selectBrands.selectedIndex = currentBrandFilter;
};




document.addEventListener('DOMContentLoaded', () =>
  fetchProducts()
    .then(setCurrentProducts)
    .then(() => render(currentProducts, currentPagination)).then(renderBrandFilter)
);


window.onscroll = function() {stickyHeader()};

var header = document.getElementById("banner");
var sticky = header.offsetTop;

function stickyHeader() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}

$(document).ready(function(){


  $("#inputname").focus(function(){
    searchBarHandler();
  });

});

function searchBarHandler(){
  var writetime = 600;
  var sr = setTimeout(() => {
    getProducts();
  }, writetime);

  function resetTimeout(timeoutObject){
    clearTimeout(timeoutObject);
    return setTimeout(() => { getProducts(); }, writetime);
  }

  $("#inputname").keyup(function(){
    resetTimeout(sr);
  });

}





// Anonymous function to handle adding a product box
var productbox = (id, name, description, price, inventory) => {

  var baseText = `
  <div class="box" id="productBoxnr${id}">
    <div>
      <h2>${name}</h2>
      <div>
        <div>
          <p>${description}</p>
        </div>
        <p>${price} kr</p>
      </div>
      <div>
        <p>${inventory} st</p>
        <button onclick="addProductToBasket('${price}','1','${id}')"> Buy </button>
      </div>

    </div>
  </div> `

return baseText
};

// Product object
function product(id, name, description, price, inventory){
  this.id = id;
  this.name = name;
  this.description = description;
  this.price = price;
  this.inventory = inventory;
};

var products = [];


// Get the products with the chosen filter
//    and call the function to add the products
//    to the website.
function getProducts() {
  $.getJSON("/api/product/get?query=" + $("#inputname").val(), function(jsonfile) {
    products = [];
    jsonfile.forEach(prod => {
      products.push(new product(prod.id, prod.name, prod.description, prod.price, prod.inventory));
    });
    addProducts();
  });

}

function addProducts(){
  $(".productbox-container").empty();
  products.forEach(prod => {
    $(".productbox-container").append(productbox(prod.id, prod.name , prod.description , prod.price, prod.inventory));
  })
}

function addProductToBasket(price, amount, product_id){
  $.post("/api/product/addToBasket/" ,{price: price, amount: 1,  product_id: product_id});
}

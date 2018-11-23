
//alert("Detta funkar till och med - Brought to you by 'public/javascripts/scripts.js linked by index.ejs");


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


  // TODO: Add database query for this instead of 
  // logging the value.
  $("#inputname").focus(function(){
    $("#inputname").keyup(function(){
      console.log($("#inputname").val());
    });
  });

  // Temporary adding of product.
  //    This is how we add the products
  $("#getterbutton").click(function(){
    
    $.getJSON( "/api/ex/json", function(jsonfile) {
      getProducts(jsonfile);
    });
  });


});





// Anonymous function to handle adding a product box
var productbox = (name, description, price) => {

  var baseText = `
  <div class="box">
    <div>
      <h2>${name}</h2> 
      <div> 
        <div> 
          <p>${description}</p>
        </div>
        <p>${price} kr</p>
      </div>
    </div>
  </div> `

return baseText
};

// Product object
var product = {
  name:"",
  description:"",
  price:""
};


function getProducts(file) {
  console.log(file);
  file.products.forEach(prod => {
    addProduct(prod);
  });

}

function addProduct(prod){
  $(".productbox-container").append(productbox(prod.name , prod.description , prod.price));
}


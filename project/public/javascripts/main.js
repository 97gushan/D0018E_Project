
$(document).ready(function(){


  $("#inputname").focus(function(){
    searchBarHandler();
  });

  $(".login").hide();

  $("#accountButton").click(function(){
      $(".login").toggle();
  });

  // Close if user clicks outside the box
  $(document).mouseup(function(e)
  {
      var container = $(".login");

      // If the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0)
      {
          container.hide();
      }
  });

  // Login function
  $("#loginbutton").click(function(){
    var uname = $("#loginusername").val();
    var pw = $("#loginpassword").val();

    $.post("/api/user/login" , {username: uname, password: pw} , function(){})
    .done(function(res) {
      location.reload();
    })
    .fail(function(res) {
      $("#loginbutton").after("<p style='color:red'> Login Failed. Please try again. </p>");
    });
  });


  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();

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

return baseText;
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
  $("#productbox-container").empty();
  products.forEach(prod => {
    $("#productbox-container").append(productbox(prod.id, prod.name , prod.description , prod.price, prod.inventory));
  })
}

function addProductToBasket(price, amount, product_id){
  $.post("/api/product/addToBasket/" ,{price: price, amount: 1,  product_id: product_id});
}


function openPage(pageName, elmnt) {
  // Hide all elements with class="tabcontent" by default */
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }

  // Remove the background color of all tablinks/buttons
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
  }

  // Show the specific tab content
  document.getElementById(pageName).style.display = "block";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = $(document.body).css("background-color");
  console.log( $(document.body).css("background-color"));

}



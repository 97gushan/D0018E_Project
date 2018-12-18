
var productWindowOpen = false;



$(document).ready(function(){


  $("#inputname").focus(function(){
    searchBarHandler();
  });

  $("#loginWindow").hide();

  $("#accountButton").click(function(){
      $("#loginWindow").toggle();
  });


  $("#productbox-container").on("click", ".innerbox", function(){
    if(productWindowOpen){
      return;
    }

    var thisID = $(this).attr("id");

    var pid = products.find(function(e){
      if("productBoxnr" + e.id == thisID)
        return e;
    });

    $("#productbox-container").append(productwindow(pid.id, pid.name, pid.description, pid.price, pid.inventory));

    dim(true);
    getProductReviews(pid.id);
    productWindowOpen = true;

  });



  // Close if user clicks outside the box
  $(document).on("mouseup", function(e)
  {
      var container = $("#loginWindow");

      // If the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0)
      {
          container.hide();
      }

      container = $("#productWindow");

      // If the target of the click isn't the container nor a descendant of the container
      if (!container.is(e.target) && container.has(e.target).length === 0 && productWindowOpen)
      {
          container.remove();
          getProducts();
          setTimeout(() => {
            productWindowOpen = false;
            dim(false);
          }, 20);
      }

  });




  // Logout function
  $("#logoutbutton").click(function(){
    location.href = '/api/user/logout/';
  });

  // Register function
  $("#registerbutton").click(function(){
    location.href = '/users/register';
  });


  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();

});

// Login function
function loginUser(){
  var loginForm = document.forms["loginWindow"];

  $.post("/api/user/login" , {username: loginForm["username"].value, password: loginForm["password"].value} , function(){})
  .done(function(res) {
    location.reload();
    //return true;
  })
  .fail(function(res) {
    $("#registerbutton").after("<p style='color:red'> Login Failed. Please try again. </p>");
    return false;
  });
}



// Add product function
function createNewProduct(){
  var productForm = document.forms["createNewProductForm"];

  $.post("/api/product/add" , {product: productForm["product"].value, price: productForm["price"].value, amount: productForm["amount"].value, category: productForm["category"].value, description: productForm["description"].value} , function(){})
  .done(function(res) {
    $("#createProductSuccess").show();
    productForm.reset();
  })
  .fail(function(res) {
    $("#createProductFailed").show();
    return false;
  });
}

// Get the modal
var prodSuccess = document.getElementById('createProductSuccess');
var prodFail = document.getElementById('createProductFailed');


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == prodSuccess) {
    prodSuccess.style.display = "none";
  }
  else if (event.target == prodFail) {
    prodFail.style.display = "none";
  }
}



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

//archive product

function deleteProduct(product_id){
  $.post("/api/product/delete/" ,{product_id: product_id})
  .done(function(res) {

    for(var i = products.length - 1; i >= 0; i--) {
        if(products[i].id == product_id) {
          products.splice(i, 1);
        }
    }

    $("#productWindow").remove();
    setTimeout(() => {
      productWindowOpen = false;
      dim(false);
    }, 20);

    addProducts();
  })
  .fail(function(res) {
    return false;
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
      tabcontent[i].className = "tabcontent tabhidden";
  }

  // Remove the background color of all tablinks/buttons
  tablinks = document.getElementsByClassName("tablink");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
  }

  if(pageName == 'Shopping'){
    getShoppingBasket();
  }
  if(pageName == 'Admin'){
    getOrders();
  }

  // Show the specific tab content
  document.getElementById(pageName).className = "tabcontent";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = $(document.body).css("background-color");

}


function dim(bool)
{
    document.getElementById('dimmer').style.display=(bool?'block':'none');
}


function getRemovedProducts(){
  $.getJSON("/api/product/get?query=" + $("#inputname").val() + "&available=0", function(jsonfile) {

    $("#removedProductsContainer").empty();

    jsonfile.forEach(prod => {
      $("#removedProductsContainer").append(` 
      <li class="w3-display-container w3-bottombar" id="removedProduct${prod.id}">
          ${prod.name} &#8209;  <i>${prod.description.substring(0,60)}</i>
          <button onclick="restoreProducts(${prod.id})" class="w3-display-right w3-button w3-circle w3-green">+</button>
      </li> `);

    });
  })
}

function restoreProducts(id){
  $.post("/api/product/restore/" ,{product_id: id})
  .done(function(res) {
    $("#removedProduct" + id).remove();
    refresh();
  })
  .fail(function(res) {
    console.log("failed");
    return false;
  });

}



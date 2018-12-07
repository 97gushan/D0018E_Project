
$(document).ready(function(){


  $("#inputname").focus(function(){
    searchBarHandler();
  });

  $("#loginWindow").hide();

  $("#accountButton").click(function(){
      $("#loginWindow").toggle();
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
      if (!container.is(e.target) && container.has(e.target).length === 0)
      {
          container.remove();
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


  $("#productbox-container").on("click", ".box", function(){
    var thisID = $(this).attr("id");

    var pid = products.find(function(e){
      if("productBoxnr" + e.id == thisID)
        return e;
    });

    $("#productbox-container").append(productwindow(pid.id, pid.name, pid.description, pid.price, pid.inventory));

    getProductReviews(pid.id);
  });



});

// Login function
function loginUser(){
  var loginForm = document.forms["loginWindow"];

  console.log(loginForm["username"].value);
  

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



function searchBarHandler(){
  var writetime = 600;
  var sr = setTimeout(() => {
    getProducts();
  }, writetime);

  function resetTimeout(timeoutObject){
    clearTmeout(timeoutObject);
    return setTimeout(() => { getProducts(); }, writetime);
  }

  $("#inputname").keyup(function(){
    resetTimeout(sr);
  });

}

// Anonymous function to handle adding a product box
var productwindow = (id, name, description, price, inventory) => {
  var baseText = `
  <div id="productWindow" class="pane">
    <div>
      <h2>${name}</h2>
      <div>
        <div>
          <p>${description}</p>
        </div>
        <p>${price} kr</p>
      <div class="rateit"> </div>
      </div>
      <div>
        <p>${inventory} st</p>
        <button onclick="addProductToBasket('${price}','1','${id}')"> Buy </button>
      </div>

    </div>
  </div> `

return baseText;
};



// Anonymous function to handle adding a product box
var productbox = (id, name, description, price, inventory) => {
  var baseText = `
  <div class="productbox" id="productBoxnr${id}">
    <div class="innerbox">
      <h2>${name}</h2>
      <div>
        <div>
          <p>${description}</p>
        </div>
        <p>${price} kr</p>
      </div>
      <div>
        <p>${inventory} st</p>
      </div>

    </div>
  </div> `

return baseText;
};

// Anonymous function to handle adding a shoppingBasketBox
var shoppingBasketBox = (name, price, amount) => {
  var baseText = `
  <div class="productbox">
    <div>
      <h2>${name} </h2>
      <div>
        <div>
          <p>${price} kr</p>
        </div>
      <div>
        <p>${amount} st </p>
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

function shopping_basket(name, price, amount){
  this.name = name;
  this.price = price;
  this.amount = amount;
};

var products = [];
var shoppingbasket = [];


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

function placeOrder(){
  //console.log("order placed");
  $.post("/api/order/placeOrder");
}


function getShoppingBasket() {
  $.getJSON("/api/product/getShoppingBasket", function(jsonfile){
    shoppingbasket = [];
    jsonfile.forEach(itemInBasket => {
      shoppingbasket.push(new shopping_basket(itemInBasket.name, itemInBasket.price, itemInBasket.amount));
    });
    addShoppingBasket();

  });
}

function addShoppingBasket(){
  $("#shoppingbasketbox-container").empty();
  shoppingbasket.forEach(itemInBasket => {
    $("#shoppingbasketbox-container").append(shoppingBasketBox(itemInBasket.name, itemInBasket.price, itemInBasket.amount));
  })
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


  // Custom page triggers
  if(pageName == 'Shopping'){
    getShoppingBasket();
  }

  // Show the specific tab content
  document.getElementById(pageName).className = "tabcontent tabshown";

  // Add the specific color to the button used to open the tab content
  elmnt.style.backgroundColor = $(document.body).css("background-color");

}


var productWindowOpen = false;
var userID;


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
    getUserOrders();
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




// Get the modal
var prodSuccess = document.getElementById('createProductSuccess');
var prodFail = document.getElementById('createProductFailed');
var orderItemModal = document.getElementById('orderItemModal');


// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == prodSuccess) {
    prodSuccess.style.display = "none";
  }
  else if (event.target == prodFail) {
    prodFail.style.display = "none";
  } else if (event.target == orderItemModal) {
    orderItemModal.style.display = "none";
  }
}

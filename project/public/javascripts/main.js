
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
var productbox = (id, name, description, price) => {

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
    </div>
  </div> `

return baseText
};

// Product object
function product(id, name, description, price){
  this.id = id;
  this.name = name;
  this.description = description;
  this.price = price;
};

var products = [];


// Get the products with the chosen filter
//    and call the function to add the products
//    to the website.
function getProducts() {
  $.getJSON("/api/product/get?query=" + $("#inputname").val(), function(jsonfile) {
    products = [];
    jsonfile.forEach(prod => {
      products.push(new product(prod.id, prod.name, prod.description, prod.price));
    });
    addProducts();
  });
  
}


function addProducts(){
  $("#productbox-container").empty();
  products.forEach(prod => {
    $("#productbox-container").append(productbox(prod.id, prod.name , prod.description , prod.price));
  })
}




function openPage(pageName) {
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

}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click(); 

function removeItemFromBasket(id){
    $("#basketBoxnr" + id).remove();

    $.post("/api/product/deleteShoppingBasketItem", {itemID: id} , function(){})
    .done(function(res) {

    });
}


function placeOrder() {
    $.post("/api/order/placeOrder");
    $("#shoppingbasketbox-container").empty();
    document.getElementById("Shopping").click();
}


function shopping_basket(id, name, price, amount) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.amount = amount;
}

var shoppingbasket = [];
var total;

function getShoppingBasket() {
    $.getJSON("/api/product/getShoppingBasket", function (jsonfile) {
        shoppingbasket = [];
        total = 0;
        jsonfile.forEach(itemInBasket => {
            total += itemInBasket.price * itemInBasket.amount;
            shoppingbasket.push(new shopping_basket(itemInBasket.id, itemInBasket.name, itemInBasket.price, itemInBasket.amount));
        });
        addShoppingBasket();
        $("#shoppingbasketSum").text("Total: " + total + "kr");
    });
    
}

function addShoppingBasket() {
    $("#shoppingbasketbox-container").empty();
    shoppingbasket.forEach(itemInBasket => {
        $("#shoppingbasketbox-container").append(shoppingBasketBox(itemInBasket.id, itemInBasket.name, itemInBasket.price, itemInBasket.amount));
    })
}





function viewOrder(id){
    $.getJSON("/users/order/" + getUserID() + "/" + id, function(jsonfile) {
      $("#orderItemModalItemBox").empty();
      $("#orderItemModalItemBox").append(`<tr> <th>Name</th>  <th>Price</th> <th>Amount</th> </tr>`);
      var total = 0;
      jsonfile.forEach(prod => {
        total += prod.price * prod.amount;
        $("#orderItemModalItemBox").append(`<tr> <td>${prod.name}</td>  <td>${prod.price}</td> <td>${prod.amount}</td> </tr>`
        );
      });
      $("#orderItemModalItemBox").append(`<h3 id="shoppingbasketSum" class="w3-right">Totalt:${total}kr</h3> `);
      $("#orderItemModal").show();
    });
  
    
  }
  
  //    to the website.
  function getUserOrders() {
      orders = [];
      $.getJSON("/api/order/getOrder/" + getUserID(), function(jsonfile) {
          jsonfile.forEach(ord => {
              orders.push(new order(ord.id, ord.username, ord.date, ord.status));
          });
          addUserOrder();
      });
    
    }
    
    
    function addUserOrder(){
      $("#userOrderBox").empty();
      orders.forEach(ord => {
        $("#userOrderBox").append(userOrderBox(ord.id, ord.name, ord.date, ord.status));
      })
    }


    // Anonymous function to handle adding a shoppingBasketBox
var userOrderBox = (id, name, date, status) => {
    var statusText = "";
    var confirmButton = "";

    if(status == 0){
        statusText = "Pending";
    }else if(status == 1){
      statusText = "Confirmed";
    }
    var baseText = `
    <div class="orderbox">
      <div>
        <h3>Order ID: ${id} </h3>
        <h4>User: ${name} </h4>
        <div>
          <div>
            <p>Date: ${date.substring(0,10)}</p>
            <p>Time: ${date.substring(11,19)}</p>
          </div>
        <div>
          <p>Status: ${statusText}</p>
        </div>
        <div>
           <button onclick="viewOrder('${id}')"> View </button>
        </div>
      </div>
    </div> `
    return baseText;
}
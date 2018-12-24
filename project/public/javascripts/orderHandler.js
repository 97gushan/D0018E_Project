function order(id, name, date, status){
    this.id = id;
    this.name = name;
    this.date = date;
    this.status = status;
};
  
var orders = [];


// Anonymous function to handle adding a shoppingBasketBox
var orderBox = (id, name, date, status) => {
    var statusText = "";
    var confirmButton = "";

    if(status == 0){
        statusText = "Pending";
    }else if(status == 1){
      statusText = "Confirmed";
      confirmButton = "disabled"
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
           <button onclick="confirmOrder('${id}')" ${confirmButton}> Confirm </button>
           <button onclick="deleteOrder('${id}')"> Delete </button>
           <button onclick="viewOrder('${id}')"> View </button>
        </div>
      </div>
    </div> `
    return baseText;
}
 
function confirmOrder(id){
  $.post("/api/order/changeStatus", {orderID:id, status:1});
}
function deleteOrder(id){
  $.post("/api/order/deleteOrder", {orderID:id});
}
  
  //    to the website.
  function getOrders() {
    orders = [];
    $.getJSON("/api/order/getOrder", function(jsonfile) {
        jsonfile.forEach(ord => {
            orders.push(new order(ord.id, ord.username, ord.date, ord.status));
        });
        addOrder();
    });
  
  }
  
  
  function addOrder(){
    $("#orderbox-container").empty();
    orders.forEach(ord => {
      $("#orderbox-container").append(orderBox(ord.id, ord.name, ord.date, ord.status));
    })
  }
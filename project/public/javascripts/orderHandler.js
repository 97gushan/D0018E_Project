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
    if(status == 0){
        statusText = "Pending";
    }
    var baseText = `
    <div class="box">
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
      </div>
    </div> `
    return baseText;
}


//    to the website.
function getOrders() {
    console.log("1");
    orders = [];
    $.getJSON("/api/order/getOrder", function(jsonfile) {
        console.log("2");
        jsonfile.forEach(ord => {
            orders.push(new order(ord.id, ord.user_id, ord.date, ord.status));
        });
        console.log("3");
        console.log(orders);
        addOrder();
    });
  
  }
  
  
  function addOrder(){
    console.log("4");
    $("#orderbox-container").empty();
    orders.forEach(ord => {
        console.log(ord);
      $("#orderbox-container").append(orderBox(ord.id, ord.name, ord.date, ord.status));
    })
    console.log("5");
  }
  

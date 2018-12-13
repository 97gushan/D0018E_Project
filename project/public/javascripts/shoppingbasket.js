
function removeItemFromBasket(id){
    $("#basketBoxnr" + id).remove();

    $.post("/api/product/deleteShoppingBasketItem", {itemID: id} , function(){})
    .done(function(res) {

    });
}


function placeOrder() {
    $.post("/api/order/placeOrder");
    $("#shoppingbasketbox-container").empty();
}


function shopping_basket(id, name, price, amount) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.amount = amount;
}

var shoppingbasket = [];


function getShoppingBasket() {
    $.getJSON("/api/product/getShoppingBasket", function (jsonfile) {
        shoppingbasket = [];
        jsonfile.forEach(itemInBasket => {
            shoppingbasket.push(new shopping_basket(itemInBasket.id, itemInBasket.name, itemInBasket.price, itemInBasket.amount));
        });
        addShoppingBasket();

    });
}

function addShoppingBasket() {
    $("#shoppingbasketbox-container").empty();
    shoppingbasket.forEach(itemInBasket => {
        $("#shoppingbasketbox-container").append(shoppingBasketBox(itemInBasket.id, itemInBasket.name, itemInBasket.price, itemInBasket.amount));
    })
}
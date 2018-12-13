
  // Anonymous function to handle adding a product box
  var productbox = (id, name, description, price, inventory) => {
    var baseText = `
    <div class="productbox">
      <div class="innerbox" id="productBoxnr${id}">
        <h3>${name}</h3>
        <div class="productdescription">
          <p>${description}</p>
        </div>
        <div>
          <h4 style="float:left">${price} kr</h4>
          <h4 style="float:right">${inventory} st</h4>
        </div>
        <div>
          <p>Click for more info</p>
        </div>

      </div>
    </div> `

  return baseText;
  };

  // Anonymous function to handle adding a shoppingBasketBox
  var shoppingBasketBox = (id, name, price, amount) => {
    var baseText = `
    <div class="shoppingbasketbox">
      <div class="innerbox" id="basketBoxnr${id}">
        <div>
          <h2>${name} </h2>
          <div>
            <div>
              <p>${price} kr</p>
            </div>
          <div>
            <p>${amount} st </p>
          </div>
          <button onclick="removeItemFromBasket('${id}')"> remove </button> 
        </div>
      </div> 
    </div>`

  return baseText;
  };

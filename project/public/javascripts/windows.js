// Anonymous function to handle adding a product box
var productwindow = (id, name, description, price, inventory) => {

    var delButton = `<button onclick="deleteProduct('${id}')"> remove </button>`;
    
    
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
          ${delButton}
        </div>
  
      </div>
    </div> `
  
  return baseText;
  };
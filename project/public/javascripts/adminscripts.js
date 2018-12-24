
$(document).ready(function(){


    $("#productbox-container").on("click", ".innerbox", function(){

        var thisID = $(this).attr("id");

        var pid = products.find(function(e){
        if("productBoxnr" + e.id == thisID)
            return e;
        });

        productBoxAddClickToChange(pid.id);
        
    });
});


function productBoxAddClickToChange(id){

    $("#itemName").editable("/api/product/edit/" + id, {
        id   : "itemType" ,
        name : "value",
        type : "text",
        cancel : 'Cancel',
        onedit : function() { return true;},
        submit : 'Save',
        tooltip : "Click to edit...",
        callback : function(result, settings, submitdata) {}
    });

    $("#itemDescription").editable("/api/product/edit/" + id, {
        id   : "itemType" ,
        name : "value",
        type : "textarea",
        cancel : 'Cancel',
        onedit : function() { return true;},
        submit : 'Save',
        tooltip : "Click to edit...",
        callback : function(result, settings, submitdata) {}
    });


    $("#itemPrice").editable("/api/product/edit/" + id, {
        id   : "itemType" ,
        name : "value",
        type : "number",
        cancel : 'Cancel',
        onedit : function() { return true;},
        submit : 'Save',
        tooltip : "Click to edit...",
        callback : function(result, settings, submitdata) {}
    });

    $("#itemInventory").editable("/api/product/edit/" + id, {
        id   : "itemType" ,
        name : "value",
        type : "number",
        cancel : 'Cancel',
        onedit : function() { return true;},
        submit : 'Save',
        tooltip : "Click to edit...",
        callback : function(result, settings, submitdata) {}    
    });


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

  

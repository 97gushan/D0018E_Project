
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
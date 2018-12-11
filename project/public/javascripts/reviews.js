$(document).ready(function(){


});

function getProductReviews(product_id){
    var avgRating = 0;

    $.getJSON("/api/product/getReviewsForItem?query=" + product_id, function(jsonfile) {
        console.log(jsonfile);
        jsonfile.forEach(review => {
            console.log(review.comment);
            console.log(review.rating);
            avgRating += review.rating;
            $("#productWindowReviews").append("<p>" + review.comment + "</p>");
        });
        avgRating = avgRating / jsonfile.length;

        $("#productWindow .rateit").first().rateit( { step : 1, max: 7, value: avgRating});
        $(".rateit").bind('rated', function (event, value) {
            $.post("/api//product/addReviewToItem/" , {product_id: product_id, rating: value});
         });
    });



}

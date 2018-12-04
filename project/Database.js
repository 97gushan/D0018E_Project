var mysql = require('mysql')
var session = require('express-session');
var bcrypt = require('bcrypt');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'password',
  database: 'D0018E',
  insecureAuth: true
})

var ses;

// Functions in the DB class that is usable by other files
//
module.exports = {
//
// ALL FUNCTIONS SHOULD RETURN SOMETHING
// If status, see specific one at
//  https://developer.mozilla.org/en-US/docs/Web/HTTP/Status


    addUser : function(req, res, next, passHash){

        var name = req.body.name;

        // TODO: fix admin registration
        var admin = req.body.admin ? 1 : 0;

        var sql = "INSERT INTO user (username, passwordhash, adminflag, rating) VALUES ?";
        var values = [[name, passHash, admin , 0]];

        connection.query(sql, [values], function(err, result){
            if(err) throw err;
            res.redirect('/');
        });

    }, loginUser : function(req, res, next,name, pass){

        var sql = "SELECT passwordHash, id, adminFlag FROM user WHERE username = ?";
        var values = [[name]];


        ses = req.session;

        connection.query(sql, [values], function(err, result){
            if(err) throw err;

            // Errorcheck if user exists
            if(typeof result == 'undefined' || result[0] == null)
                return res.sendStatus(401);




            // compare the  password
            bcrypt.compare(pass, result[0].passwordHash, function(err, response){

                if(response){
                    ses.username = name;
                    ses.userID = result[0].id;
                    ses.adminFlag = result[0].adminFlag;

                    return res.sendStatus(200);
                }
                else{
                    return res.sendStatus(401);
                }
            });




        });



    },addProductToDB : function(req, res, next, name, price, inventoryAmount, description, category) {

        var sql = "INSERT INTO product (name, price, inventory, description, category) VALUES ?";
        var values = [[name, price,  inventoryAmount, description, category]];

        connection.query(sql, [values], function(err, result){
            if(err) throw err;
            res.sendStatus(201);

        });


    },
    // GET PRODUCT FROM DB
    // RETURNS A JSON FILE
    getProductFromDb : function(req, res, next) {

        // Use SQL wilfcard '%' to get everything that contains
        //      the search string.
        var value = "%" + req.query.query + "%";

        // Using LIKE parameter to get wildcards to work, se ref:
        //      https://www.w3schools.com/sql/sql_wildcards.asp
        var sql = "SELECT * FROM product WHERE name LIKE " + connection.escape(value) + "AND available=1";

        connection.query(sql, function(err, result) {
            if(err) throw err;
            res.send(result);
        });

    },

    // DELETE PRODUCT FROM DB
    // RETURNS A 202 MESSAGE
        deleteProductFromDb : function(req, res, next) {

            // Use SQL wilfcard '%' to get everything that contains
            //      the search string.
            var value = req.query.query;

            // Using LIKE parameter to get wildcards to work, se ref:
            //      https://www.w3schools.com/sql/sql_wildcards.asp

            var sql = "UPDATE product SET available = 0 WHERE name LIKE " + connection.escape(value);

            connection.query(sql, function(err, result) {
                if(err) throw err;
                res.send(202);
            });

    },
    addToShoppingBasket : function(req, res, next, price, amount, userId, productId) {

        var sql = "INSERT INTO shopping_basket (price, amount, user_id, product_id) VALUES ?";
        var values = [[ price,  amount, userId, productId]];

        connection.query(sql, [values], function(err, result){
            if(err) throw err;
            res.sendStatus(201);

        });
    },
    // GET shopping basket FROM DB
    // RETURNS A JSON FILE
    getShoppingBasket : function(req, res, next) {


        var sql = "SELECT product.name, shopping_basket.price, shopping_basket.amount FROM shopping_basket " +
        "INNER JOIN product ON product.id=shopping_basket.product_id WHERE user_id = ?";
        var userID = req.session.userID;
        var value = [[userID]];

        connection.query(sql, [value], function(err, result) {
            if(err) throw err;
            res.send(result);
        });

    },

    placeOrder : function(res, userID){
        var sqlGetWares = "SELECT * FROM shopping_basket WHERE user_id = ?";
        var value = [[userID]];

        var wares;

        connection.query(sqlGetWares, [value], function(err, result){
            if(err) throw err;
            wares = result;

            if(wares.length > 0){
                value = [[userID, 0]];

                var sqlCreateOrder = "INSERT INTO orders (user_id, status) VALUES ?";
                var orderID;

                connection.query(sqlCreateOrder, [value], function(err, result){
                    if(err) throw err;
                    // Get order id from result after insertion in db
                    orderID = result.insertId;


                    var sqlAddWaresToOrder = "INSERT INTO order_item (price, amount , order_id, product_id) VALUES ?";
                    values = [];

                    // add all the interesting values to a list
                    wares.forEach(ware => {
                        values.push([ware.price, ware.amount, orderID, ware.product_id]);
                    });

                    connection.query(sqlAddWaresToOrder, [values], function(err, result){
                        if(err) throw err;
                        //console.log("order placed");

                        var sqlRemoveWaresFromBasket = "DELETE FROM shopping_basket WHERE user_id = ?";
                        value = [[userID]];
                        connection.query(sqlRemoveWaresFromBasket, [value], function(err, result){
                            if(err) throw err;
                            //console.log("wares removed");
                            res.sendStatus(200);
                        });

                    });
                });
            }
        });

    }
};

var mysql = require('mysql')
var session = require('express-session');
var bcrypt = require('bcrypt');
var async = require("async");

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'password',
    database: 'D0018E',
    insecureAuth: true
})

var ses;


/* Functions in the DB class that is usable by other files */
module.exports = {
    /*
    ALL FUNCTIONS SHOULD RETURN SOMETHING
    If status, see specific one at
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */


    /* Create a new user */
    addUser: function (req, res, next) {

        var pass = req.body.password;

        // Hash password
        bcrypt.hash(pass, 1, function(err, hash){

            var name = req.body.name;

            // TODO: fix admin registration
            if (req.body.admin == 1)
            var admin = 1;
            else {
            var admin = 0;
            }

            var sql = "INSERT INTO user (username, passwordhash, adminflag, rating) VALUES ?";
            var values = [[name, hash, admin, 0]];

            connection.query(sql, [values], function (err, result) {
                if (err) throw err;
                res.redirect('/');
            });
        });

    },

    /* Log in user */
    loginUser: function (req, res, next) {

        ses = req.session;
        var name = req.body.username;
        var pass = req.body.password;

        var sql = "SELECT passwordHash, id, adminFlag FROM user WHERE username = ?";
        var values = [[name]];

        connection.query(sql, [values], function (err, result) {
            if (err) throw err;

            // Errorcheck if user exists
            if (typeof result == 'undefined' || result[0] == null)
                return res.sendStatus(401);

            // compare the  password
            bcrypt.compare(pass, result[0].passwordHash, function (err, response) {

                if (response) {
                    ses.username = name;
                    ses.userID = result[0].id;
                    ses.adminFlag = result[0].adminFlag;

                    return res.sendStatus(200);
                } else {
                    return res.sendStatus(401);
                }
            });
        });
    },

    /* Create a new item */
    addProductToDB: function (req, res, next) {

        if(!req.body.product)
            return res.sendStatus(400);


        var product = req.body.product;
        var price = req.body.price;
        var inventoryAmount = req.body.amount;
        var description = req.body.description;
        var category = req.body.category;


        var sql = "INSERT INTO product (name, price, inventory, description, category, available) VALUES ?";
        var values = [[product, price, inventoryAmount, description, category, 1]];

        connection.query(sql, [values], function (err, result) {
            if (err) throw err;
            res.sendStatus(201);

        });


    },

    /* GET PRODUCT FROM DB
       RETURNS A JSON FILE */
    getProductFromDb: function (req, res, next) {

        // Use SQL wilfcard '%' to get everything that contains
        //      the search string.
        var value = "%" + req.query.query + "%";
        var available;

        if(req.query.available)
            available = req.query.available;
        else
            available = 1;

        // Using LIKE parameter to get wildcards to work, se ref:
        //      https://www.w3schools.com/sql/sql_wildcards.asp
        var sql = "SELECT * FROM product WHERE name LIKE " + connection.escape(value) + "AND available = " + connection.escape(available);

        connection.query(sql, function (err, result) {
            if (err) throw err;
            res.send(result);
        });

    },

    /* DELETE PRODUCT FROM DB
       RETURNS A 202 MESSAGE*/
    deleteProductFromDb: function (req, res, next) {

        // Use SQL wilfcard '%' to get everything that contains
        //      the search string.
        var value = req.body.product_id;
        // Using LIKE parameter to get wildcards to work, se ref:
        //      https://www.w3schools.com/sql/sql_wildcards.asp

        var sql = "UPDATE product SET available = 0 WHERE id LIKE " + connection.escape(value);

        connection.query(sql, function (err, result) {
            if (err) throw err;
            res.sendStatus(202);
        });

    },

        /* RESTORE PRODUCT FROM DB
       RETURNS A 202 MESSAGE*/
       restoreProductFromDb: function (req, res, next) {

        var value = req.body.product_id;

        var sql = "UPDATE product SET available = 1 WHERE id LIKE " + connection.escape(value);

        connection.query(sql, function (err, result) {
            if (err) throw err;
            res.sendStatus(202);
        });

    },


     /* Edit a product */
     editProduct: function (req, res, next) {

        var itemType = req.body.itemType;
        var value = req.body.value;
        var productID = req.params.id;

        var queryType = "";

        switch (itemType) {
            case "itemName":
                queryType = "name";
                break;

            case "itemDescription":
                queryType = "description";
                break;
            case "itemPrice":
                queryType = "price";
                break;
            case "itemInventory":
                queryType = "inventory";
                break;
    
            default:
                console.log("Whoops, wrong itemType of type: " + itemType);
                return res.sendStatus(400);
        }

        var sqlChangeStatus = "UPDATE product SET " + queryType + " = ? WHERE ID = ?";

        var input = [value, productID];
        connection.query(sqlChangeStatus, input, function (err, response) {
            if (err) throw err;
            res.send(value);
        });

    },

    /* Add item to shopping basket */
    addToShoppingBasket: function (req, res, next) {


        var price = parseInt(req.body.price);
        var amount = parseInt(req.body.amount);
        var product_id = parseInt(req.body.product_id);
        var user_id = req.session.userID;
        console.log(user_id + " " + product_id);


        var sqlLookupInBasket = "SELECT * FROM shopping_basket WHERE product_id = " + 
                connection.escape(product_id) + " AND user_id = " + connection.escape(user_id);

        console.log(sqlLookupInBasket);

        // check if the product exists in a users shoppingbasket
        connection.query(sqlLookupInBasket, function (err, result) {
            // if the product does not exist in the shoppingbasket
            // add it

            console.log(result);

            if (!result || result.length == 0) {
                var sqlInsertToBasket = "INSERT INTO shopping_basket (price, amount, user_id, product_id) VALUES ?";
                var values = [[price, amount, user_id, product_id]];

                connection.query(sqlInsertToBasket, [values], function (err, result) {
                    if (err) throw err;
                    return res.sendStatus(201);

                });
            } else {
                // if the product does exist then update amount
                var sqlReduceInventory = "UPDATE shopping_basket SET amount = amount + ? WHERE user_id = ? AND product_id = ?";
                var values_increase = [amount, user_id, product_id];

                connection.query(sqlReduceInventory, values_increase, function (err, result) {
                    if (err) throw err;
                    return res.sendStatus(201);
                });
            }
        });


    },

    /* GET shopping basket FROM DB
       RETURNS A JSON FILE */
    getShoppingBasket: function (req, res, next) {
        var sql = "SELECT product.id, product.name, shopping_basket.price, shopping_basket.amount FROM shopping_basket " +
            "INNER JOIN product ON product.id=shopping_basket.product_id WHERE user_id = ?";
        var userID = req.session.userID;
        var value = [[userID]];

        connection.query(sql, [value], function (err, result) {
            if (err) throw err;
            res.send(result);
        });

    },

    /* Removes a product from the shopping basket */
    deleteShoppingBasketItem: function (req, res, next) {

        var userID = req.session.userID;
        var itemID = req.body.itemID;

        var sql = "DELETE FROM shopping_basket WHERE user_id = " + connection.escape(userID) +
        " AND product_id = " + connection.escape(itemID);

        connection.query(sql, function (err, result) {
            if (err) throw err;
            res.sendStatus(200);
        });
    },

    /* Get reviews and ratings from database for a specific product */
    getReviewsForItem: function (req, res, next) {

        var prodID = parseInt(req.query.query);
       var sql =  "SELECT review.rating, review.comment, user.username FROM review " +
        "INNER JOIN user ON user.id=review.user_id WHERE product_id = ?";
        var value = [[prodID]];

        connection.query(sql, [value], function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    },

    /* Add a new review and rating for a product */
    addReviewToItem: function (req, res, next) {
        ses = req.session;

        var rating = null;
        var comment = null;

        var userID = ses.userID;
        var productID = req.body.product_id;
        var sql;
        var value;

        // Check if user is logged in
        if (userID >= 0) {
            if (req.body.rating) {
                rating = req.body.rating;
                value = [[rating, userID, productID]];

                sql = "INSERT INTO review (rating, user_id, product_id) VALUES ? ON DUPLICATE KEY UPDATE rating = " + connection.escape(rating);
            }

            if (req.body.comment) {
                comment = req.body.comment;
                value = [[comment, userID, productID]];

                sql = "INSERT INTO review (comment, user_id, product_id) VALUES ? ON DUPLICATE KEY UPDATE comment = " + connection.escape(comment);
            }

            connection.query(sql, [value], function (err, result) {
                if (err) {throw err;}

                return res.sendStatus(200);
            });
        }

    },

    /* Places an order */
    placeOrder: function (req, res, next) {

        connection.beginTransaction(function (err) {
            if (err) {throw err;}

            var userID =  req.session.userID;

            // Excecutes the functions within in order to avoid nesting hell
            async.waterfall([
                function(callback){

                    var sqlGetWares = "SELECT * FROM shopping_basket WHERE user_id = ?";

                    connection.query(sqlGetWares, userID , function (err, result) {
                        if (err) throw err;
                        if (result.length <= 0)
                            callback(true, result);

                        callback(null, result);
                    });
    
                },
                function(args, callback){
                    
                    var sqlCreateOrder = "INSERT INTO orders (user_id, status) VALUES ?";
                    var values = [[[userID, 0]]];

                    // Create a order in the orders table
                    connection.query(sqlCreateOrder, values, function (err, result) {
                        if (err) throw err;
                        // Get order id from result after insertion in db
                        callback(null, result.insertId, args);
                    });
                    
                },
                function(orderID, args, callback){
                    
                    var sqlAddWaresToOrder = "INSERT INTO order_item (price, amount , order_id, product_id) VALUES ?";
                    var wares = [];
                    
                    // add all the interesting values to a list
                    args.forEach(ware => {
                        wares.push([ware.price, ware.amount, orderID, ware.product_id]);
                    });

                    // Add the wares to the order_item table
                    connection.query(sqlAddWaresToOrder, [wares], function (err, result) {
                        if (err) throw err;
                    
                        console.log(wares);
                        callback(null, args);
                    });
    
                },
                function(args, callback){

                    var sqlRemoveWaresFromBasket = "DELETE FROM shopping_basket WHERE user_id = ?";
                    
                    connection.query(sqlRemoveWaresFromBasket, [userID], function (err, result) {
                        if (err) throw err;
                        console.log(args);
                        callback(null, args);
                    });                    
                    
    
                },
                function(args, callback){

                    // Remove the wares from the shopping basket
                    var sqlReduceInventory = "UPDATE product SET inventory = inventory - ? WHERE id = ?";
                    var values_reduce = [];
                    args.forEach(ware => {
                        values_reduce.push(ware.amount, ware.product_id);
                    });
                    
                    console.log(values_reduce);

                    connection.query(sqlReduceInventory, values_reduce, function (err, result) {
                        if (err) throw err;
                        callback(null);
                    });
                }
                ],
                function(err, results){
                    if (err){ 
                        console.log(err);
                        res.sendStatus(400);
                    }
                    connection.commit(function(err) {
                        if (err) {
                          return connection.rollback(function() {
                            throw err;
                          });
                        }
                        return res.sendStatus(200);
                      });
                }
            );
        });
    },

    /* Edit an order */
    editOrderStatus: function (req, res, next) {


        var status = req.body.status;
        var orderID = req.body.orderID;

        var sqlChangeStatus = "UPDATE orders SET status = ? WHERE ID = ?";

        var value_order = [status, orderID];
        connection.query(sqlChangeStatus, value_order, function (err, response) {
            if (err) throw err;
            res.sendStatus(200);
        });

    },

    /* Get selected order */
    getOrders: function (req, res, next) {

        
        if(req.session.adminFlag && !req.params.userID){
            var sqlGetOrders = "SELECT orders.id, orders.date, orders.status, user.username FROM orders " +
            "INNER JOIN user ON user.id=orders.user_id";
        }
        else if(req.session.adminFlag && req.params.userID){
            var userID = req.params.userID;

            var sqlGetOrders = "SELECT orders.id, orders.date, orders.status, user.username FROM orders " +
            "INNER JOIN user ON user.id=orders.user_id WHERE orders.user_id = " + userID;
        }
        else{
            var userID = req.session.userID;

            var sqlGetOrders = "SELECT orders.id, orders.date, orders.status, user.username FROM orders " +
            "INNER JOIN user ON user.id=orders.user_id WHERE orders.user_id = " + userID;
        }
            

        connection.query(sqlGetOrders, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    },

    getOrderItems: function (req, res, next) {
        var sql = "SELECT orders.id, orders.status, orders.date, product.name, orders.user_id, order_item.amount, order_item.price " +
        " FROM ((orders INNER JOIN order_item ON order_item.order_id = orders.id) " +
        " INNER JOIN product ON product.id=order_item.product_id) WHERE order_id = ?;";

        var orderID = req.params.orderID;
        var value = [[orderID]];

        connection.query(sql, [value], function (err, result) {
            if (err) throw err;

            // Last sanity check. Should be in users but i dont want to change the DB tables
            //          or make a connection there, which would fix it.
            if(result[0].user_id == req.session.userID || req.session.adminFlag)
                res.send(result);
            else
                res.sendStatus(403);
        });

    },

    /* Delete an order */
    deleteOrder: function (req, res, next) {

        var orderID = req.body.orderID;
        var valueOrder = [[orderID]];


        connection.beginTransaction(function (err) {
            if (err) {throw err;}

            async.waterfall([
                function(callback){

                    var sqlGetOrderItems = "SELECT product_id, amount FROM order_item WHERE order_id = ?";
                    
                    connection.query(sqlGetOrderItems, [valueOrder], function (err, result) {
                        if(err) throw err;
            
                        var values_increase = [];
                        result.forEach(ware => {
                            values_increase.push(ware.amount, ware.product_id);
                        });

                        callback(null, values_increase);
                    });
                },
                function(wares, callback){
                    var sqlDeleteOrderItems = "DELETE FROM order_item WHERE order_id = ?";


                    connection.query(sqlDeleteOrderItems, [valueOrder], function (err, result) {
                        if (err) throw err;
                        callback(null, wares);
                    });


                },
                function(wares, callback){
                    var sqlIncreaseInventory = "UPDATE product SET inventory = inventory + ? WHERE id = ?";

                    // When an order is deleted the amount in the inventory gets increased back to
                    // its originall value
                    connection.query(sqlIncreaseInventory, wares, function (err, result) {
                        if (err) throw err;
                        callback(null)
                    });
                },
                function(callback){
                    var sqlDeleteOrder = "DELETE FROM orders WHERE id = ?";
                    connection.query(sqlDeleteOrder, [valueOrder], function (err, result) {
                        if (err) throw err;
                        callback(null);
                    });
                }
                ],
                function(err, results){
                    if (err){ 
                        console.log(err);
                        return res.sendStatus(400);
                    }
                    connection.commit(function(err) {
                        if (err) {
                            return connection.rollback(function() {
                                throw err;
                            });
                        }
                        return res.sendStatus(200);
                    });
                });

        });
            
    }

};

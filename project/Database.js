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

/* Functions in the DB class that is usable by other files */
module.exports = {
    /*
    ALL FUNCTIONS SHOULD RETURN SOMETHING
    If status, see specific one at
    https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
    */


    /* Create a new user */
    addUser: function (req, res, next, passHash) {

        var pass = req.body.password;

        // Hash password
        bcrypt.hash(pass, 1, function(err, hash){
        });
        var name = req.body.name;

        // TODO: fix admin registration
        var admin = req.body.admin ? 1 : 0;

        var sql = "INSERT INTO user (username, passwordhash, adminflag, rating) VALUES ?";
        var values = [[name, passHash, admin, 0]];

        connection.query(sql, [values], function (err, result) {
            if (err) throw err;
            res.redirect('/');
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

        // Using LIKE parameter to get wildcards to work, se ref:
        //      https://www.w3schools.com/sql/sql_wildcards.asp
        var sql = "SELECT * FROM product WHERE name LIKE " + connection.escape(value) + "AND available=1";

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
        console.log(value);
        // Using LIKE parameter to get wildcards to work, se ref:
        //      https://www.w3schools.com/sql/sql_wildcards.asp

        var sql = "UPDATE product SET available = 0 WHERE id LIKE " + connection.escape(value);

        connection.query(sql, function (err, result) {
            if (err) throw err;
            res.sendStatus(202);
        });

    },
    
    /* Add item to shopping basket */    
    addToShoppingBasket: function (req, res, next) {


        var price = parseInt(req.body.price);
        var amount = parseInt(req.body.amount);
        var product_id = parseInt(req.body.product_id);
        var user_id = req.session.userID;


        var sqlLookupInBasket = "SELECT * FROM shopping_basket WHERE product_id = ?";
        var value_product = [[product_id]];

        // check if the product exists in a users shoppingbasket
        connection.query(sqlLookupInBasket, [value_product], function (err, result) {
            // if the product does not exist in the shoppingbasket
            // add it
            if (result.length == 0) {
                var sqlInsertToBasket = "INSERT INTO shopping_basket (price, amount, user_id, product_id) VALUES ?";
                var values = [[price, amount, user_id, product_id]];

                connection.query(sqlInsertToBasket, [values], function (err, result) {
                    if (err) throw err;
                    res.sendStatus(201);

                });
            } else {
                // if the product does exist then update amount
                var sqlReduceInventory = "UPDATE shopping_basket SET amount = amount + ? WHERE user_id = ? AND product_id = ?";
                var values_increase = [amount, user_id, product_id];

                connection.query(sqlReduceInventory, values_increase, function (err, result) {
                    if (err) throw err;
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

        var sql = "SELECT rating, comment, user_id FROM review WHERE product_id = ?";
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
                if (err) {

                    throw err;
                }
                return res.sendStatus(200);
            });
        }

    },

    /* Places an order */
    placeOrder: function (req, res, next) {
        var sqlGetWares = "SELECT * FROM shopping_basket WHERE user_id = ?";
        var value_user = [[req.session.userID]];

        var wares;

        //console.log("1. Get wares form sb");
        connection.query(sqlGetWares, [value_user], function (err, result) {
            if (err) throw err;
            wares = result;

            if (wares.length > 0) {

                value_order = [[userID, 0]];

                var sqlCreateOrder = "INSERT INTO orders (user_id, status) VALUES ?";
                var orderID;
                //console.log("2. create order");
                // Create a order in the orders table
                connection.query(sqlCreateOrder, [value_order], function (err, result) {
                    if (err) throw err;
                    // Get order id from result after insertion in db
                    orderID = result.insertId;


                    var sqlAddWaresToOrder = "INSERT INTO order_item (price, amount , order_id, product_id) VALUES ?";
                    values_wares = [];

                    // add all the interesting values to a list
                    wares.forEach(ware => {
                        values_wares.push([ware.price, ware.amount, orderID, ware.product_id]);
                    });

                    //console.log("3. create order items");
                    // Add the wares to the order_item table
                    connection.query(sqlAddWaresToOrder, [values_wares], function (err, result) {
                        if (err) throw err;
                        //console.log("order placed");

                        // Remove the wares from the shopping basket
                        var sqlRemoveWaresFromBasket = "DELETE FROM shopping_basket WHERE user_id = ?";
                       // console.log("4. delete from shopping basket");
                        connection.query(sqlRemoveWaresFromBasket, [value_user], function (err, result) {
                            if (err) throw err;
                            console.log("***********wares removed ****************** ");
                            res.sendStatus(200);
                        });

                        var sqlReduceInventory = "UPDATE product SET inventory = inventory - ? WHERE id = ?";
                        var values_reduce = [];
                        wares.forEach(ware => {
                            values_reduce.push(ware.amount, ware.product_id);
                        });
                        //console.log(wares);
                        //console.log("5. Reduce inventory");
                        connection.query(sqlReduceInventory, values_reduce, function (err, result) {
                            if (err) throw err;
                            console.log("*********** Reduced inventory ****************** ");
                        });

                    });

                });
            }
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
        var sqlGetOrders = "SELECT orders.id, orders.date, orders.status, user.username FROM orders " +
            "INNER JOIN user ON user.id=orders.user_id";


        connection.query(sqlGetOrders, function (err, result) {
            if (err) throw err;
            res.send(result);
        });
    },

    /* Delete an order */
    deleteOrder: function (req, res, next) {

        var orderID = req.body.orderID;
        var sqlGetOrderItems = "SELECT product_id, amount FROM order_item WHERE order_id = ?";
        var valueOrder = [[orderID]];

        connection.query(sqlGetOrderItems, [valueOrder], function (err, result) {
            if(err) throw err;
            
            //console.log(result);
            var values_increase = [];
            result.forEach(ware => {
                values_increase.push(ware.amount, ware.product_id);
            });

            var sqlDeleteOrderItems = "DELETE FROM order_item WHERE order_id = ?";
        

            connection.query(sqlDeleteOrderItems, [valueOrder], function (err, result) {
                if (err) throw err;


                var sqlIncreaseInventory = "UPDATE product SET inventory = inventory + ? WHERE id = ?";

                // When an order is deleted the amount in the inventory gets increased back to
                // its originall value
                connection.query(sqlIncreaseInventory, values_increase, function (err, result) {
                    if (err) throw err;
                    //console.log("************ Inventory increased ******************");
                });

                var sqlDeleteOrder = "DELETE FROM orders WHERE id = ?";
                connection.query(sqlDeleteOrder, [valueOrder], function (err, result) {
                    if (err) throw err;
                    res.sendStatus(200);
                });

            });
        });   
    }
    
};
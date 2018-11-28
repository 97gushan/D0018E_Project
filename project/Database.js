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


    addUser : function(req, res, next,name, passHash){
        var sql = "INSERT INTO user (username, passwordhash, adminflag, rating) VALUES ?";
        var values = [[name, passHash, 0, 0]];

        connection.query(sql, [values], function(err, result){
            if(err) throw err;
            res.sendStatus(201);
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

                    res.sendStatus(200);
                }
                else{
                    res.sendStatus(401);
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
        var sql = "SELECT * FROM product WHERE name LIKE " + connection.escape(value);

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
            var sql = "DELETE FROM product WHERE name LIKE " + connection.escape(value);

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
    getShoppingBasket : function(req, res, next, userID) {


        var sql = "SELECT * FROM shopping_basket WHERE user_id = ?";
        var value = [[userID]];

        connection.query(sql, [value], function(err, result) {
            if(err) throw err;
            res.send(result);
        });

    },
};

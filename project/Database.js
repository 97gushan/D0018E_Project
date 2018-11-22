console.log("Database.js");
var mysql = require('mysql')
var session = require('express-session');
var bcrypt = require('bcrypt');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'password',
  database: 'D0018E'
})



module.exports = {
    addUser : function(name, passHash){
        var sql = "INSERT INTO user (username, passwordhash, adminflag, rating) VALUES ?";
        var values = [[name, passHash, 0, 0]];

        connection.query(sql, [values], function(err, result){
            if(err) throw err;
            console.log("User added");
        });
 
    }, loginUser : function(name, pass){
    
        var sql = "SELECT passwordHash, id, adminFlag FROM user WHERE username = ?";
        var values = [[name]];

        connection.query(sql, [values], function(err, result){
            if(err) throw err;
            
            // compare the  password
            bcrypt.compare(pass, result[0].passwordHash, function(err, res){
                console.log(res);
                console.log("Checked");

                if(res){
                    session.userID = result[0].id;
                    session.adminFlag = result[0].adminFlag;
                }
            });
         
        });

    
        
    },addProductToDB : function(name, price, inventoryAmount, description, category) {

        var sql = "INSERT INTO product (name, price, inventory, description, category) VALUES ?";
        var values = [[name, price,  inventoryAmount, description, category]];

        connection.query(sql, [values], function(err, result){
            if(err) throw err;
            console.log("Product added");
        });
        

    }, getProductFromDb : function() {
        console.log("Adding product -- NOT DONE");


        var sql = "SELECT * FROM product"
        connection.query(sql, function(err, result){
            if(err) throw err;
            console.log(result[0].id)
            console.log(result[0].name)
            console.log(result[0].price)
            console.log(result[0].inventory)
            console.log(result[0].description)
            console.log(result[0].category)
        });

        

    }

};

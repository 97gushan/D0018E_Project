console.log("Database.js");
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'password',
  database: 'D0018E'
})



module.exports = {
    addUser : function(name, passHash){
        console.log("Adding user -- NOT DONE");
        connection.connect(function(err){
            if (err) throw err
            console.log('You are now connected...')

            var sql = "INSERT INTO user (username, passwordhash, adminflag, rating) VALUES ?";
            var values = [[name, passHash, 0, 0]];

            connection.query(sql, [values], function(err, result){
                if(err) throw err;
                console.log("User added");
            });
        });
        
    }, addProductToDB : function(name, price, inventoryAmount, description, category) {
        connection.connect(function(err) {
            if (err) throw err
            console.log('You are now connected...')

            var sql = "INSERT INTO product (name, price, inventory, description, category) VALUES ?";
            var values = [[name, price,  inventoryAmount, description, category]];

            connection.query(sql, [values], function(err, result){
                if(err) throw err;
                console.log("Product added");
            });
        });
        
    }, getProductFromDb : function() {
        console.log("Adding product -- NOT DONE");

        connection.connect(function(err) {
            if (err) throw err
            console.log('You are now connected...')

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
        });
        
    }

};



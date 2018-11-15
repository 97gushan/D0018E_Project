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
    addUserToDB : function(){
        console.log("Adding user -- NOT DONE");
        
    }, addProductToDB : function(name, price, inventoryAmount, description, category) {
        console.log("Adding product -- NOT DONE");

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


        connection.di
    }
  };





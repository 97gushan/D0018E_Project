console.log("Database.js");
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: '',
  database: 'D0018E'
})

-*connection.connect(function(err) {
  if (err) throw err
  console.log('You are now connected...')
})-* 

module.exports = {
    addUserToDB : function(){
        console.log("Adding user -- NOT DONE");
        
    }, addProductToDB : function() {
        console.log("Adding product -- NOT DONE");

    }
  };





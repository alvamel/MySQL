// mysql & enquirer

var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: "loclhost",
    port: 3000,
    user: "root", // username
    password: "bootcamp", // password
    database: "bamazon"
})

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
})

// queries

connection.query('Select * From products', function(err, res, field) {
    if (err) throw err;
    console.log(res);
})

// uses npm inquirer to get user answer for Id & quantity

inquirer.prompt([{
    name: "ID",
    message: "What product ID do you want to buy?"
},{
    name: "quantity",
    message: "How many would you like to buy?"
}])

// .then put answers to a variable

.then(function(answers) {
    var productID = answers.ID;
    var productStock = answers.quantity;

// creates mysql connection w/query

connection.query('Select stockQuantity From products Where ?', {iemID: productID}, function(err, res, field) {
    var currentStock = res[0].stockQuantity;
    if (err) throw err;

    if(productStock > currentstock) {
        console.log("Sorry, out of stock!");
    } else {
        console.log("in stock!");
        console.log("Currently we have" + currentStock + "in stock");
        var newStock = currentStock - productStock - updateStock(newStock, productID);
    }
})

})

// update stock runs update mysql query and updates table

var updateStock = function(neStock, productID) {
    connection.query('Update products Set ? Where ?', [{stockQuantity: newStock}, {itemID: productID}], function(err, res) {
        if (err) throw err;
        console.log(" ");
        console.log("the stock leftover now has" + res[0].stockQuantity);
    })

    connection.query('Select price From products Where ?', {itemID: productID}, function(err, res) {
        if (err) throw err;
        console.log(" ");
        console.log("Your total cost is" + res[0].price);
    })
}
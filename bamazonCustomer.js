// mysql and npm package
var mysql = require('mysql');
var inquirer = require('inquirer');

// connect to sql server
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon_DB',
})

// counter for total number of products
var numberOfProductsTypes = 0;

// connect to database
coonection.connect(function(err) {
    if (err) throw err;
    // promise that selects all data from table
    new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM products', function(err, res) {
            if (err) reject(err);
            resolve(res);
            console.log('Welcome to Bmamzon! Here are our products:')
        })
        // console.log each item and increment num of products
    }).then(function(result) {
        result.forEach(function(item) {
            numberOfProductTypes ++;
            console.log('Item ID: ' + item.item_id + ' || Product Name: ' + item.product_name + ' || Price: ' + item.price);
        })
        // enter the store
    }).then(function() {
        return enterStore();
        // catch error
    }).catch(function(err) {
        console.log(err);
    })
})

// function to enter the store
function enterStore() {
    inquirer.prompt([{
        name: 'entrance',
        message: 'Would you like to shop with us today?',
        type: 'list',
        choices: ['Yes', 'No']
    }]).then(function(answer) {
        // go to customer shopping menu if yes
        if (answer.entrance === 'Yes') {
            menu();
        } else {
            // exits cli if no
            console.log('Please come back soon! --Bamazon');
            connection.destroy();
            return;
        }
    })
}

// function for the menu option for the customer
function menu() {
    return inquirer.prompt([{
        name: 'item',
        message: "Enter the item number of th product you would like to purchase.",
        type: 'input',
        // validates product number is a number and it exits
        validate: function(value) {
            if ((isNaN(value) === false) && (value <= numberOfProductTypes)) {
                return true;
            } else {
                console.log('\nPlease enter a valid ID.');
                return false;
            }
        }
    }, {
        name: 'quantity',
        message: 'How many would you like to buy?',
        type: 'input',
        // validate to make sure it is number
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log('\nPlease enter a valid quantity.');
                return false;
            }
        }
        // new promise to pull all data from sql
    }]).then(function(answer) {
        return new Promise(function(resolve, reject) {
            connection.query('SELECT * FROM products WHERE ?', { item_id: answer.item }, function(err, res) {
                if (err) reject(err);
                resolve(res);
            })
            // .then if selected quantity is valid, save to a local object, else console log error
        }).then(function(result) {
            var saveData = {};

            if (parseInt(answer.quantity) <= parseInt(result[0].stock_quantity)) {
                saveData.answer = answer;
                saveData.result = result;
            } else if (parseInt(answer.quantity) > parseInt(result[0].stock_quntity)) {
                console.log('an error occured, exiting Bamazon, your order is not complete.');
            }

            return saveData;
            // update the sql db and console.log messages 
            }).then(function(saveData) {
                if (saveData.answer) {
                    var updateQuantity = parseint(saveData.result[0].stock_quantity) - parseInt(saveData.answer.quantity);
                    var itemId = saveData.answer.item;
                    var totalCost = parseInt(saveData.result[0].price) * parseInt(saveData.answer.quantity);
                    connection.query('UPDATE products SET ? WHEERE ?', [{
                        stock_quantity: updateQuantity
                    }, {
                        item_id: itemID
                    }], function(err, res) {
                        if (err) throw err;
                        console.log('Your order total cost $' + totalCost + '. Thank you for shopping with Bamazon!');
                        connection.destroy();
                    })
                } else {
                    // recurtion to enter store
                    enterStore();
                }
                // catch errors
            }).catch(function(err) {
                console.log(err);
                connection.destroy();
            })
            // catch errors
            }).catch(function(err) {
                console.log(err);
                connection.destroy();
            });
}
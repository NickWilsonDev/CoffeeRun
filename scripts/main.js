/* main.js */

var orderList;
var URL = "https://dc-coffeerun.herokuapp.com/api/coffeeorders/";

var makeOrderListItem = function (order) {
    var $listElement = $('<li>').addClass('list-group-item');
    $listElement.attr('id', order.emailAddress);
    $listElement.text(order.emailAddress + ' Order: ' 
                    + order.coffee + ' Size: ' 
                    + order.size + ' Flavor shot: ' 
                    + order.flavor + ' Strength Level: ' 
                    + order.strength);
    // listener for removing
    $listElement.click( function(event) {
        console.log("inside element click handler " + this.id);
        var index = findByAttr(orderList, 'emailAddress', this.id);
        console.log(index);
        var order = orderList[index];
        orderList.splice(index, 1);
        $listElement.css("background-color","green");

        $listElement.off('click');
        $listElement.on('click', function () {
                console.log("inside inner handler " + this);
                $listElement.css("background-color", "white");
                clearTimeout(timer);
                $listElement.off('click');
        }); 
        var timer = window.setTimeout(function(order) {
                        console.log("deleting");
                        $($listElement).remove();
                        }, 2000);
        var ajaxDelete = fetch(URL + order.emailAddress,
                        {
                            method: 'delete'
                        })
                        .then(function (response) {
                            console.log(response);
                        });
       
    });
    
    $('#previousOrders').append($listElement);
};

var populatePreviousOrders = function (orderList) {
    for (var i = 0; i < orderList.length; i++) {
        makeOrderListItem(orderList[i]);
    }
};

$(document).ready(function() {
    // AJAX on page load, grab orders from server
    var getResponse = fetch(URL)
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(jsonData) {
                            console.log("Data fetched from server");
                            orderList = []; 
                            for (key in jsonData) {
                                orderList.push(jsonData[key]);
                            }
                            populatePreviousOrders(orderList);
                        });
});

var findByAttr = function (array, attr, value) {
    for (var i = 0; i < array.length; i++) {
        console.log(array[i]);
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
};

var checkEmail = function (email) {
    re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return re.test(email);
};

$form = $('form');

$form[0].addEventListener('submit', function(event) {
    event.preventDefault();
    var order = {
        coffee: $('#coffeeOrder')[0].value,
        emailAddress: $('#emailInput')[0].value,
        size: $('[name="size"]')[0].value,
        flavor: $('#flavorShot')[0].value,
        strength: $('#strengthLevel')[0].value
    };
    orderList.push(order);
    makeOrderListItem(order);
    var fetchPost = fetch(URL,
                        {
                            method: 'POST',
                            body: JSON.stringify(order),
                            headers: new Headers({
                                'Content-Type': 'application/json'
                            })
                        });
    $form[0].reset();
});

/* ---------------- Populate functionality ---------------- */

orders = [
    {"strength":0,"flavor":"None","size":"tall","emailAddress":"person@email.com","coffee":"Coffee"}, 
    {"strength":3,"flavor":"mocha","size":"tall","emailAddress":"jamlicious@gmail.com","coffee":"latte"},
    {"flavor":"almond","strength":30,"size":"short","emailAddress":"xyz@who.com","coffee":"latte"},
    {"strength":10,"flavor":"caramel","size":"tall","emailAddress":"uni@gallop.org","coffee":"love"},
]

var $popBtn = $('#popBtn');
$popBtn[0].addEventListener('click', function(event) {
    event.preventDefault();
    for (var i = 0; i < orders.length; i++) {
        var order = {
            coffee: orders[i]['coffee'],
            emailAddress: orders[i]['emailAddress'],
            size: orders[i]['size'],
            flavor: orders[i]['flavor'],
            strength: orders[i]['strength']
        };
        var populatePost = $.post(URL, order);
        populatePost.then(function(resp) {
            console.log(resp)
        });
    }
});


/* main.js */

var orderList;


var deleteRequest = function (element) {
        //var index = findByAttr(orderList, 'email', this.id);
        //orderList.splice(index, 1);
        console.log("deleting");
        $(element).remove();
}


var makeOrderListItem = function (order) {
    console.log("-----------------");
    console.log(order);
    var $listElement = $('<li>').addClass('list-group-item');
    $listElement.attr('id', order.emailAddress);
    $listElement.text(order.emailAddress + ' Order: ' 
                    + order.coffee + ' Size: ' 
                    + order.size + ' Flavor shot: ' 
                    + order.flavor + ' Strength Level: ' 
                    + order.strength);
    // listener for removing
    $listElement.click( function(event) {
    
        var index = findByAttr(orderList, 'email', this.id);
        orderList.splice(index, 1);
        $listElement.css("background-color","green");
        $listElement.off('click');
        window.setTimeout(function() {
                    console.log("deleting");
                    $($listElement).remove();
                    }, 2000);
        $.ajax({
            url: "https://dc-coffeerun.herokuapp.com/api/coffeeorders/" 
                                            + order.emailAddress,
            type: 'DELETE',
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
    $.get("https://dc-coffeerun.herokuapp.com/api/coffeeorders", function (data) { 
        console.log("Data fetched from server");
        orderList = []; 
        for (key in data) {
            console.log(data[key]);
            orderList.push(data[key]);
        }
        console.log(orderList);
        populatePreviousOrders(orderList);
    });
});

var findByAttr = function (array, attr, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}


var checkEmail = function (email) {
    re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    return re.test(email);
}

$form = $('form');

$form[0].addEventListener('submit', function(event) {
    console.log("submit order");
    event.preventDefault();
    var order = {
        coffee: $('#coffeeOrder')[0].value,
        emailAddress: $('#emailInput')[0].value,
        size: $('[name="size"]')[0].value,
        flavor: $('#flavorShot')[0].value,
        strength: $('#strengthLevel')[0].value
    };

    orderList.push(order);
    console.log(order);
    makeOrderListItem(order);
    console.log(JSON.stringify(order));
    $.post("https://dc-coffeerun.herokuapp.com/api/coffeeorders", order, function(resp) {
      console.log(resp)
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

        console.log(order);
        $.post("https://dc-coffeerun.herokuapp.com/api/coffeeorders", order, function(resp) {
            console.log(resp)
        });
    }
});


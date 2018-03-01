/* main.js */

var orderList;

$(document).ready(function() {
    
    $(window).bind("beforeunload", function() { 
        localStorage.setItem('orderList', JSON.stringify(orderList)); 
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

var makeOrderListItem = function (order) {
    var $listElement = $('<li>').addClass('list-group-item');
    $listElement.attr('id', order.email);
    $listElement.text(order.email + ' Order: ' 
                    + order.coffeeOrder + ' Size: ' 
                    + order.size + ' Flavor shot: ' 
                    + order.flavorShot + ' Strength Level: ' 
                    + order.strengthLevel);
    // listener for removing
    $listElement.click( function(event) {
        var index = findByAttr(orderList, 'email', this.id);
        orderList.splice(index, 1);
        $(this).remove();
    });

    $('#previousOrders').append($listElement);
};

var populatePreviousOrders = function (orderList) {
    for (var i = 0; i < orderList.length; i++) {
        makeOrderListItem(orderList[i]);
    }
};

if (!localStorage.getItem('orderList')) {
    orderList = [];
} else {
    orderList = localStorage.getItem('orderList');
    if (orderList) {
        orderList = JSON.parse(orderList);
        populatePreviousOrders(orderList);
    } else {
        console.log("Could not parse/load json");
        orderList = [];
    }
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
        coffeeOrder: $('#coffeeOrder')[0].value,
        email: $('#emailInput')[0].value,
        size: $('[name="size"]')[0].value,
        flavorShot: $('#flavorShot')[0].value,
        strengthLevel: $('#strengthLevel')[0].value
    };
    
    orderList.push(order);
    console.log(order);
    makeOrderListItem(order);
    $form[0].reset();
});



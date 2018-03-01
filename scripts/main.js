/* main.js */

var orderList;


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
    $.ajax({
        url: "http://dc-coffeerun.herokuapp.com/api/coffeeorders/" 
                                            + order.emailAddress,
        type: 'DELETE',
    });
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

$(document).ready(function() {
    // AJAX on page load, grab orders from server
    $.get("http://dc-coffeerun.herokuapp.com/api/coffeeorders", function (data) { 
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
    $.post("http://dc-coffeerun.herokuapp.com/api/coffeeorders", order, function(resp) {
      console.log(resp)
    });
    $form[0].reset();
});


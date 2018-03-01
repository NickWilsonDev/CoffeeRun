
orders = [
    {"strength":0,"flavor":"None","size":"tall","emailAddress":"person@email.com","coffee":"Coffee"}, 
    {"strength":3,"flavor":"mocha","size":"tall","emailAddress":"jamlicious@gmail.com","coffee":"latte"},
    {"flavor":"almond","strength":30,"size":"short","emailAddress":"xyz@who.com","coffee":"latte"},
    {"strength":10,"flavor":"caramel","size":"tall","emailAddress":"uni@gallop.org","coffee":"love"},
]


var $popBtn = $('#popBtn');
$popBtn[0].addEventListener('submit', function(event) {
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
        $.post("http://dc-coffeerun.herokuapp.com/api/coffeeorders", order, function(resp) {
            console.log(resp)
        });
});


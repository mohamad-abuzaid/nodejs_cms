    var paypal = require('paypal-rest-sdk'),
            str = require('./_String');


    module.exports = {
        intent: 'sale',
        payment_method: 'paypal',
        Redirect: [],
        currency_type: "USD",
        Configure: function (_config_data) {
            paypal.configure(_config_data);
            return this;
        },
        SetItems: function (_items) {
            var TotalePrice = new Number();
            if (_items.hasOwnProperty('item_list')) {
                if (_items.item_list.hasOwnProperty('items')) {
                    _items.item_list.items.forEach(function (val, key) {
                        var _price = 0;
                        if (val.price > 0) {
                            _price = val.price;
                            if (val.quantity > 1) {
                                _price = Number(val.price) * val.quantity;
                            }
                            TotalePrice = Number(TotalePrice) + Number(_price);
                        }
                    });
                }
            }
            var payReq = JSON.stringify({
                "intent": this.intent,
                "payer": {
                    "payment_method": this.payment_method
                },
                "redirect_urls": this.Redirect,
                "transactions": [{
                        "item_list": _items.item_list,
                        "amount": {
                            "currency": this.currency_type,
                            "total": TotalePrice
                        },
                        "description": _items.description
                    }]
            });
            str.pr(payReq, true);
            str.pr(parseFloat(TotalePrice, '0'));
//            return true;
            paypal.payment.create(payReq, function (error, payment) {
                if (error) {
                    str.pr(error);
                } else {
                    str.pr("Create Payment Response");
                    str.pr(payment);
                }
            });
            return this;
        },
    };


    /*
     * use
     *
     */


//    paypal.Configure(Config.PaypalConfig);
//    paypal.payment_method = 'paypal';
//    paypal.Redirect = {
//        return_url: 'http://127.0.0.1:8081/process',
//        cancel_url: 'http://127.0.0.1:8081/cancel'
//    };
//    paypal.SetItems({
//        "item_list": {
//            "items": [{
//                    "name": "item0",
//                    "sku": "item0",
//                    "price": "1.00",
//                    "currency": "USD",
//                    "quantity": "3"
//                }, {
//                    "name": "item1",
//                    "sku": "item1",
//                    "price": "2.50",
//                    "currency": "USD",
//                    "quantity": "1"
//                }]
//        },
//        "description": "This is the payment description."
//    });
function checkout()
{
    alert('hdhbfd')

     $.ajax({
        url:'/place-order',
        method:'post',
        data:$('#checkout-form').serialize(),
        success:(response)=>{
           alert('hello kskjdnvjsdnvjknv')
            if(response.codsuccess)
            {
                alert('hello')
                location.href='/thanks'
            }
            else
            {
               razorpayPayment(response)
            }
                     function razorpayPaymen(order)
{
    var options = {
"key": 'rzp_test_D9qPkXEj6U7pmM', // Enter the Key ID generated from the Dashboard
"amount": order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
"currency": "INR",
"name": "Acme Corp",
"description": "Test Transaction",
"image": "https://example.com/your_logo",
"order_id": order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
"handler": function (response){
alert(response.razorpay_payment_id);
alert(response.razorpay_order_id);
alert(response.razorpay_signature);
verifyPayment(response,order)
},
"prefill": {
"name": "Gaurav Kumar",
"email": "gaurav.kumar@example.com",
"contact": "9999999999"
},
"notes": {
"address": "Razorpay Corporate Office"
},
"theme": {
"color": "#3399cc"
}
};
var rzp1 = new Razorpay(options);
rzp1.open();

}
        }
        

    })
}
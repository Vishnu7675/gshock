var express = require('express');
var router = express.Router();
var dataHelper=require('../helpers/user-data-helper')
var adminHelper= require('../helpers/admin-data-helper');
const userDataHelper = require('../helpers/user-data-helper');
const { getAllUsers, getProducts } = require('../helpers/admin-data-helper');
const { response } = require('express');
const config = require("../config/config");
const { Db } = require('mongodb');
const res = require('express/lib/response');
const async = require('hbs/lib/async');
const client = require("twilio")(config.accountSID,config.authToken)
const paypal = require('paypal-rest-sdk');
const { TrustProductsEntityAssignmentsInstance } = require('twilio/lib/rest/trusthub/v1/trustProducts/trustProductsEntityAssignments');
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': process.env.CLIENT_ID,
  'client_secret': process.env.CLIENT_SECRECT
});
const verifyLogin=(req,res,next)=>{
  if(req.session.user)
  {
    next()
  }
else
{
  res.redirect('/login')
}
}

// paypal.configure({
//   'mode': 'sandbox', //sandbox or live
//   'client_id': 'Ac41xwt1ATjKyl4YfJnEWybEXYCsVlWnNR7OK9kpqzrZsBpG9L-Zu-_TmZBWUJepsqhlinC14NEcHyMQ',
//   'client_secret': 'ENiDOP-VbuSRcVZyLsALoR8AvSC-VDe-Hu_HmOARROOJZnu4cKyO1K7i8YP0tleBW0oMebnUY2rGEwNU'
// });
var loginStatus={}
let otp

/* GET home page. */
// router.get('/', function(req, res, next) {
//   if(req.session.user){
//     let user=req.session.user
//     adminHelper.getProducts().then((allproducts)=>{
//         console.log(allproducts)
//       // res.render('admin/admin-products',{admin:true,allproducts})
//       res.render('user/user-home', { user:true,allproducts});
    
//   })
   
//   }else{
//     res.redirect('/login')
//   }
// });

// router.get('/login',(req,res)=>{
//   if(req.session.user){ 
//             res.redirect('/')
//   }

//   else{
//             res.render('user/user-login')
//   }
// })
// router.get('/signup',(req,res)=>{
//   res.render('user/user-signup')
// })
// router.post('/signup',(req,res)=>{
 
//   dataHelper.doSignup(req.body).then((result)=>{
//     console.log(result);
//     req.session.user=result
    
//     res.redirect('/login')
    
    
//     // res.redirect('/login')
    
//   })
// })
// router.post('/login',(req,res)=>{
//   dataHelper.doLogin(req.body).then((userCheck)=>{
//     console.log(userCheck);
//     if(userCheck){
//         if(userCheck.blockUsers){
//           loginStatus.blocked=true
//           console.log("Blocked");
//           res.redirect('/login')
          
//         }
//       else if(userCheck.email===req.body.email && userCheck.password===req.body.password){
//         console.log("logged");
//         req.session.loggedIn=true
//         req.session.user=userCheck
//         res.redirect('/')
//     }
//     }else{
//       loginStatus.err=true
//       res.redirect('/login')
//     }
//   })
// })

// router.get('/logout',(req,res)=>{
//   req.session.loggedIn=false
//   req.session.user=null
//   res.redirect('/login')
// })

router.get('/', async  function(req, res, next) {
  
      
    let user=req.session.user
    // let cartCount=await userDataHelper.getCartCount(req.session.user._id)
    let banner= await userDataHelper.getBanner()
    
    console.log('banner')
    console.log(banner)
    //  console.log('cartcount='+cartCount)
      adminHelper.getProducts().then((allproducts)=>{

        res.render('user/user-home',{user:true,allproducts,banner})
      })



    

    

});

router.get('/login',(req,res)=>{
  if(req.session.user){ 
            res.redirect('/')
  }

  else{
            res.render('user/user-login',{loginStatus})
            
  }
})

router.get('/signup',(req,res)=>{
  res.render('user/user-signup')
})

router.post('/signup',(req,res)=>{
 
  dataHelper.doSignup(req.body).then((result)=>{
    console.log(result);
    req.session.user=result
    
    res.redirect('/login')
    
  })
})
router.post('/login',(req,res)=>{
  dataHelper.doLogin(req.body).then((userCheck)=>{
    console.log(userCheck);
    if(userCheck){
        if(userCheck.blockUsers){
          loginStatus.blocked=true
          console.log("Blocked");
          res.redirect('/login')
          
        }
      else if(userCheck.email===req.body.email && userCheck.password===req.body.password){
        console.log("logged");
        req.session.loggedIn=true
        req.session.user=userCheck
        res.redirect('/')
    }
    }else{
      loginStatus.err=true
      res.redirect('/login')
    }
  })
})

router.get('/logout',(req,res)=>{
  req.session.loggedIn=false
  req.session.user=null
  res.redirect('/login')
})

router.get('/view-product',(req,res)=>{
  
  let proId=req.query.product
  console.log('query is'+proId)
  userDataHelper.viewProduct(proId).then((product)=>{
    res.render('user/view-product',{user:true,product})
    console.log(product)
    
  })
 

})
router.get('/otplogin',(req,res)=>{
  res.render('user/otplogin')
})

router.post('/otplogin',(req,res)=>{

  otp = req.body.phonenumber
  dataHelper.otpLogin(otp).then((user)=>{
    if(user)
    {
      client
      .verify
      .services(config.serviceID)
      .verifications
      .create({
          to:`+91${req.body.phonenumber}`,
          channel:'sms'
      })
      .then((data)=>{
        res.render('user/enter-otp')
         
      })
    

    }
    else
    {
      loginStatus.otperr=true
      res.redirect('/')
      
    }

  })






})

router.post('/verify',(req,res)=>{
  
  client
  .verify
  .services(config.serviceID)
  .verificationChecks
  .create({
      to:`+91${otp}`,
      code:req.body.code

  })
  .then((data)=>{
    console.log(data)
    req.session.user=true
      res.redirect('/')
    
  

  })
})



router.get('/mens-collection',(req,res)=>{
  userDataHelper.getProducts().then((MensCollection)=>{
    console.log(MensCollection)
    res.render('user/mens-collection',{user:true,MensCollection})
  })

})
router.get('/womens-collection',(req,res)=>{
  userDataHelper.getWomensCollection().then((WomensCollection)=>{
  
    res.render('user/womens-collection',{user:true,WomensCollection})
  })

})
router.get('/bestsellingcollection',async(req,res)=>{
  let best= await userDataHelper.bestsellingCollection()
  res.render('user/bestsellingcollection',{user:true,best})
})

router.get('/menformal',async(req,res)=>{
  let menFormal= await userDataHelper.menFormalcollection()
  res.render('user/menFormal',{user:true,menFormal})
})
router.get('/womenformal',async(req,res)=>{
  let womenFormal= await userDataHelper.womenFormalcollection()
  res.render('user/womenFormal',{user:true,womenFormal})
})
router.get('/mencasual',async(req,res)=>{
  let menCasual= await userDataHelper.menCasualcollection()
  res.render('user/menCasual',{user:true,menCasual})
})
router.get('/view-product2',(req,res)=>{
  res.render('user/view-product')
})
router.get('/cart',verifyLogin,async(req,res)=>{
  let products=await userDataHelper.getCartProducts(req.session.user._id)

  let subtotal=await userDataHelper.getSubtotal(req.session.user._id)
  console.log(subtotal)
   
  console.log(products)
  let total=0
  if(products.length>0)
  {
     total=await userDataHelper.getTotalAmount(req.session.user._id)
     res.render('user/cart',{user:true,products,total,subtotal,userloggedin:true})
   

  }
  else

  {
    res.render('user/empty',{user:true})
  }

 
  


})

router.get('/add-to-cart/:id',(req,res)=>{
  console.log('cart api call..................')
  userDataHelper.addToCart(req.params.id,req.session.user._id)

})
router.post('/change-product-quantity',(req,res,next)=>{
  console.log('hello1')
  console.log(req.body)
  console.log('userid',req.session.user._id)
  let userId=req.session.user._id
  userDataHelper.changeProductQuantity(req.body).then(async(response)=>{
    console.log('change productquantity response',response)
     total= await userDataHelper.getTotalAmount(userId)
      console.log(response)
     response.total=total
     
     res.json(response)
    
   


  })
})
router.post('/pay', async(req, res) => {
  console.log('orderId..............')

  console.log(req.query)
 userDataHelper.paypalOrder(req.query.orderId)


let total=await userDataHelper.getTotalAmount(req.session.user._id)
let total1=""+total
console.log(total)


  const create_payment_json = {
    "intent": "sale",
    "payer": {
        "payment_method": "paypal"
    },
    "redirect_urls": {
        "return_url": "http://localhost:3000/success",
        "cancel_url": "http://localhost:3000/cancel"
    },
    "transactions": [{
        "item_list": {
            "items": [{
                "name": "Red Sox Hat",
                "sku": "001",
                "price": total,
                "currency": "USD",
                "quantity": 1
            }]
        },
        "amount": {
            "currency": "USD",
            "total":total
        },
        "description": "Hat for the best team ever"
    }]
};

paypal.payment.create(create_payment_json, function (error, payment) {
  if (error) {
    console.log(error)
      throw error;
    
  } else {
      for(let i = 0;i < payment.links.length;i++){
        if(payment.links[i].rel === 'approval_url'){
          console.log('link.........................')
          console.log(payment.links[i].href )
          // res.redirect(payment.links[i].href);
          let link1=""+payment.links[i].href
          console.log(payment.links[i].href )
          res.json(payment.links[i].href)
        }
      }
  }
});

});

router.get('/success',async (req, res) => {
  let total=await userDataHelper.getTotalAmount(req.session.user._id)
  console.log(req.body)
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;
  
  const execute_payment_json = {
    "payer_id": payerId,
    "transactions": [{
        "amount": {
            "currency": "USD",
            "total": total
        }
    }]
  };

  paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
    if (error) {
        console.log(error.response);
        throw error;
    } else {
        console.log(JSON.stringify(payment));
        // res.send('Success');
        res.render('user/thanks',{user:true})
    }
});
});


router.get('/place-order',async(req,res)=>{
  let total = await userDataHelper.getTotalAmount(req.session.user._id)
  let address= await userDataHelper.getUseraddress(req.session.user._id)
  console.log('addrwess         cccccccccccccccccccccc')
  console.log(address)
  // let address1=address.userAddress.address
  console.log('client side')
 

   res.render('user/place-order',{total,address})



})
router.get('/cancel', (req, res) => 
  
res.redirect('/place-order')

);
router.get('/removeCart',(req,res)=>{
  console.log('remove cart............................')
console.log(req.query)
let proId = req.query.proId
userId = req.session.user._id
  
  userDataHelper.removeFromCart(proId,userId).then((response)=>{
    res.json(response)
  })

})

// router.post('/place-order',async(req,res)=>{

// console.log(req.body)

// let productList = await userDataHelper.getCartProductList(req.session.user._id)
//  let total=await userDataHelper.getTotalAmount(req.session.user._id)
//  let userId= req.session.user._id
// // if(req.body['payment-method']=='paypal')
// // {
// //   console.log('paypal...........................................')
 
// // }

//  userDataHelper.placeOrder(req.body,productList,total,userId).then((orderId)=>{
//    console.log(req.body)

//   if(req.body['payment-method']=='cod')
//   {
//      res.json({codsuccess:true})
//     // res.render('user/thanks',{user:true})
//   }
//   else if(req.body['payment-method']=='Razorpay')
//   {
//     res.json(response)
    
//     userDataHelper.generateRazorpay(orderId,total).then((response)=>{
     
      
    
      

//     })
//   }
//   else if(req.body['payment-method']=='paypal'){
  
//     res.json({paypal:true})
//   }
//   // else{
//   //   console.log('paypal..................................')
//   //   res.json({paypal:true})
   
    
    
//   // }

 
  

//            })
// })
// router.post('/place-order',(req,res)=>{
//   console.log(req.body)
// })
router.post('/checkout',  verifyLogin,  async(req,res)=>{
  let totalAmount
  console.log('checkout body');
  console.log(req.body);
let product=await userDataHelper.getCartProductList(req.session.user._id)
let totalAmount1= await userDataHelper.getTotalAmount(req.session.user._id)
let updatedPrice = req.body.updatedPrice

if(updatedPrice)
{
  totalAmount = updatedPrice
}
else
{
  totalAmount = totalAmount1
}

if(req.body.savedAddress){
    console.log("addressIdddddddddddddddddddd",req.body['savedAddress']);
    let savedAddress = await userDataHelper.findSavedaddress(req.body.savedAddress)
    console.log('saved addres.......')
    console.log(savedAddress)
    let order={
                                                                              

    firstName: savedAddress.firstName,
    lastName: savedAddress.lastName,
    address : savedAddress.address,
    city : savedAddress.city,
    state : savedAddress.state,
    // locationMark : savedAddress.locationMark,
    pincode : savedAddress.pincode,
    phonenumber : savedAddress.phonenumber,
    'payment-method':req.body['payment-method']
    }

    userDataHelper.placeOrder(order,product,totalAmount,req.session.user._id).then((orderId)=>{
      if(req.body['payment-method']==='cod'){
        res.json({codSuccess:true})
      }else if(req.body['payment-method']==='Razorpay'){
        userDataHelper.generateRazorpay(orderId,totalAmount).then((response)=>{
          res.json(response)
        })
      }else if(req.body['payment-method']==='paypal'){
          console.log("paypal");
          res.json({isPaypal:true,orderId})
      }
        })


  }
else{

   userDataHelper.placeOrder(req.body,product,totalAmount,req.session.user._id).then((orderId)=>{
     
    
        if(req.body['payment-method']==='cod'){
            res.json({codSuccess:true})
          }else if(req.body['payment-method']==='Razorpay'){
            userDataHelper.generateRazorpay(orderId,totalAmount).then((response)=>{
              res.json(response)
            })
          }else if(req.body['payment-method']==='paypal'){
              console.log("paypal");
              res.json({isPaypal:true,orderId})
              console.log('oorderID',orderId)
          }
        })

  }
     


    })
router.get('/thanks',(req,res)=>{
  userDataHelper.deleteCart(req.session.user._id)
  res.render('user/thanks',{user:true})

})
router.get('/order-history',async(req,res)=>{
   
  let userId=req.session.user._id

  let orderHistory = await userDataHelper.getOrderhistory(userId)
  console.log(orderHistory)
  res.render('user/order-history',{user:true,orderHistory})

  

})
router.get('/reject/:id',async(req,res)=>{
  let orderId = req.params.id
  let userId=req.session.user._id

  let orderHistory = await userDataHelper.getOrderhistory(userId)
   
  adminHelper.reject(orderId)
  // res.render('user/order-history',{user:true,orderHistory})
res.redirect('/order-history')

  

})

router.post('/verify-payment',(req,res)=>{
  console.log('verify payment')
  console.log(req.body)
  userDataHelper.verifyPayment(req.body).then(()=>{
     userDataHelper.changePaymentStatus(req.body['order[receipt]']).then(()=>{
       res.json({status:true})
     })
  }).catch((err)=>{
    res.json({status:false})
  })
  
})
router.get('/wishlist',verifyLogin,async(req,res)=>{
 let wishlist = await userDataHelper.getWishlist(req.session.user._id)
 console.log(wishlist)
  if(wishlist[0])
  {
  res.render('user/wishlist',{wishlist,user:true})
  }
  else{
  res.render('user/emptywishlist',{user:true})
  }

})
router.post('/add-to-wishlist/:id',(req,res)=>{

  let proId=req.params.id
  let uId=req.session.user._id
  userDataHelper.addTowishlist(uId,proId)
 

})
router.get('/userprofile',async (req,res)=>{
  let user = await userDataHelper.userProfile(req.session.user._id)
   console.log('userId'+req.session.user._id)
   res.render('user/profile',{user:true,user})


})
router.get('/edit-profile',(req,res)=>{
  res.render('user/edit-profile')
})
router.post('/addprofile',(req,res)=>{
  console.log(req.files)
  let image=req.files.userpic
  image.mv('./public/'+req.session.user._id+'.jpg',(err)=>{
    if(!err)
    {
      res.redirect('/user/userprofile')
    }
    else
    {
      console.log(err)
    }
  })
  
  // res.redirect('/admin')



})
router.get('/manageAddress',async(req,res)=>{
  let address=await userDataHelper.getUseraddress(req.session.user._id)
  if(address)
  {
    res.render('user/manageAddress',{user:true,address})
  }
  else{
    
    res.render('user/manageAddress',{user:true})
  }

})
router.get('/addAddress',(req,res)=>{
res.render('user/addAddress',{user:true})
   
})

router.post('/addAddress',(req,res)=>{
userDataHelper.userAddress(req.body,req.session.user._id)
res.render('user/addAddress',{user:true})
})
router.get('/changepassword',(req,res)=>{
  res.render('user/changepassword',{user:true})
})
router.post('/changePassword',async(req,res)=>{
  let passwordMatch=true
 let user =await userDataHelper.findPassword(req.session.user._id)
 if(req.body.passwordold==user.password)
 {
    userDataHelper.updatePassword(req.session.user._id,req.body.passwordnew).then(()=>{
      res.render('user/changepassword',{user:true})

     
    })


    
 }
 else
 {
    passwordNotmatch=true
    res.render('user/changepassword',{user:true,passwordNotmatch})
 }
 console.log(req.body)
 console.log(user)
})
router.get('/deleteAddress',(req,res)=>{
userDataHelper.deleteAddress(req.query.addressId)


})
// router.post('/placeordersaved',async(req,res)=>{
// console.log('placeorder saved ')
//   let productList = await userDataHelper.getCartProductList(req.session.user._id)
//   let total=await userDataHelper.getTotalAmount(req.session.user._id)
//   let userId= req.session.user._id
//  let address=await userDataHelper.findAddress(req.body.address)
// //  userDataHelper.placeOrdersaved(address,productList,total,req.session.user._id).then((order)=>{
// //    console.log(order)

// //  })
// userDataHelper.savedPlaceorder()
// })

// router.post('/savedplaceorder',async(req,res)=>{
//   let productList = await userDataHelper.getCartProductList(req.session.user._id)
//   let total=await userDataHelper.getTotalAmount(req.session.user._id)
//   let userId= req.session.user._id
 
 
//   userDataHelper.placeOrder(req.body,productList,total,userId).then((orderId)=>{
 
//    if(req.body['payment-method']=='cod')
//    {
//      res.render('user/thanks',{user:true})
//    }
//    else if(req.body['payment-method']=='Razorpay')
//    {
//      console.log('generate')
//      userDataHelper.generateRazorpay(orderId,total).then((response)=>{
//        console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
//        console.log(response)
//        res.json(response)
     
       
 
//      })
//    }
//    else
//    {
//      console.log('invalid payment option')
//    }
     
   
 
//             })
// })
router.post('/getcoupon',async(req,res)=>{
  console.log('coupon code')
  console.log(req.body.couponcode)
  let code=req.body.couponcode+""
  adminHelper.couponvalidityCheck(code).then(async(response)=>{
    console.log('coupon response')
    console.log(response)
    let date = new Date();

    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    
    date =  yyyy + '-' + mm + '-' + dd;
    console.log('modified date',date)
   
    if(response)
    {
             if( date < response.expiry ){
                 console.log('valid coupon')
               let msg=""
                var  subtotal
     
              let total = await userDataHelper.getTotalAmount(req.session.user._id)
              let discount=response.discount
               let  disAmount= total*(discount/100)
               subtotal=total-disAmount
            console.log('updated subtotal')
            console.log(subtotal)
            let result = {
             disAmount : disAmount,
            subtotal : subtotal
            }
          res.json(result)
          }
          else
             {
       
            console.log('expired coupn')
             res.json(null)
              } 
     
      
    
    
    } 
    else{
      res.json(response)
    }
  

    
   
  })



})
router.post('/searchproduct',async(req,res)=>{
  console.log(req.body)
 let product = await userDataHelper.searchProduct(req.body.data)
 res.render('user/search',{user:true,product})
 console.log(product)
})
router.get('/editaddress/:id',async(req,res)=>{
 let address =  await userDataHelper.findAddress(req.params.id)
 console.log('edit address',address)
  res.render('user/editAddress',{address})
})
router.post('/updateAddress/:id',(req,res)=>{
  console.log(req.body)
  console.log(req.params.id)
  userDataHelper.updateAddress(req.body,req.params.id)
  res.redirect('/manageAddress')
  
  
})
router.get('/deleteWishlist',(req,res)=>{
 userDataHelper.deleteWishlist(req.query.proId)
 res.send('/delete')
})
router.get('/editprofileinfo',async(req,res)=>{
  let user = await userDataHelper.userProfile(req.session.user._id)
  res.render('user/editprofileinfo',{user:true,user})
})
router.post('/updateprofile',(req,res)=>{
  userDataHelper.updateprofileInfo(req.session.user._id,req.body)
 res.redirect('/userprofile')

})


module.exports = router;
// paypal

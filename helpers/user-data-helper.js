var db=require('../config/connection')
var collection=require('../config/collection')
var objectId=require('mongodb').ObjectId

const { response } = require('express')
const { ORDER_COLLECTION, PRODUCT_COLLECTION } = require('../config/collection')
const Razorpay = require('razorpay')
const { reject } = require('./admin-data-helper')
const async = require('hbs/lib/async')
const res = require('express/lib/response')
var instance = new Razorpay({
    key_id: 'rzp_test_D9qPkXEj6U7pmM',
    key_secret: '5ubC2Tz8EAaxc3sZKGBBHFTd',
  });
  let deletedCart
module.exports={
    doSignup:(userData)=>{
        
        return new Promise(async(resolve,reject)=>{
            
            
            
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
               console.log(data);
                db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(data.insertedId)}).then((newUser)=>{

                    resolve(newUser)
                })
             })
        })
    },
     
        doLogin:(userData)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.USER_COLLECTION).findOne(userData).then((user)=>{
                    resolve(user)
                })
       
                
            })
        },

        viewProduct:(productId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(productId)}).then((product)=>{
                    resolve(product)
                })
            })
        },
        otpLogin:(userData)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.USER_COLLECTION).findOne({phonenumber:userData}).then((user)=>{
                    resolve(user)
                })
            })
        },

     
     
    
    
        getProducts:()=>{
            return new Promise(async(resolve,reject)=>{

                let MensCollection =await db.get().collection(collection.PRODUCT_COLLECTION).find({category:'MEN'}).toArray()
                
                resolve(MensCollection)
                
            })
        },
        getWomensCollection:()=>{
            return new Promise(async(resolve,reject)=>{
                let MensCollection =await db.get().collection(collection.PRODUCT_COLLECTION).find({category:'WOMEN'}).toArray()
                
                resolve(MensCollection)
                
            })
        },

        addToCart:(proId,userId)=>{
            let proObj={
                
                    item:objectId(proId),
                    quantity:1
                
            }
            return new Promise(async(resolve,reject)=>{
                let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
                if(userCart){
                    let proExist=userCart.products.findIndex(product=>product.item==proId)
                    if(proExist!=-1){
                        db.get().collection(collection.CART_COLLECTION)
                        .updateOne({user:objectId(userId),'products.item':objectId(proId)},
                        {
                            
                            $inc:{'products.$.quantity':1}
                        }
                        ).then(()=>{
                            resolve()
                        })
                    }
                    else{
                     db.get().collection(collection.CART_COLLECTION)
                     .updateOne({user:objectId(userId)},
                     {
                     $push:{products:proObj}
                     }
                     ).then((response)=>{
                         resolve()
                     })

                }
            }
                else{
                    let cartObj={
                        user:objectId(userId),
                        products:[proObj]
                    }
                    db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                        resolve()
                    })              }
            })
        },
        getCartProducts:(userId)=>{
            return new Promise(async(resolve,reject)=>{
                let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                    {
                        $match:{user:objectId(userId)}
                    },
                    {
                        $unwind:'$products'
                    },
                    {
                        $project:{
                            item:'$products.item',
                            quantity:'$products.quantity'
                        }

                    },
                    {
                        $lookup:{
                            from:collection.PRODUCT_COLLECTION,
                            localField:'item',
                            foreignField:'_id',
                            as:'product'
                        }
                    },
                    {
                        $project:{
                            item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                        }

                    }
                  
                ]).toArray()
               
                resolve(cartItems)
            })
        },
        getCartCount:(userId)=>{
            
            return new Promise(async(resolve,reject)=>{
                let count=0
                let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
                if(cart)
                {
                    count=cart.products.length
                }
                
                resolve(count)
            })
        },
   
    // getCartCount:(userId)=>{
    //     return new Promise(async(resolve,reject)=>{
          
    //         count= await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
      
    //         if(count){ 
    //             count=(count.products.length)
    //             resolve(count)
    //         }else{
    //             resolve(0)
    //         }
    //     })
    // },

    removeFromCart:(proId,userId)=>{
        console.log('removee from cart.......................')

        return new Promise((resolve,reject)=>{

             db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:objectId(userId)},  
                                                {
                                                 $pull:{
                                                     products:{item:objectId(proId)}
                                                    }
                                                }).then(()=>{
                                                    resolve({response:true})
                                                    console.log(response.status)
                                                })
            
             
            
        })

    },

    // changeProductQuantity:(details)=>{
        
    //     details.count=parseInt(details.count)
        
        
    //     return new Promise(async(resolve,reject)=>{
    //         if(details.quantity==1 && details.count==-1){
    //             db.get().collection(collection.CART_COLLECTION)
    //                 .updateOne({_id:objectId(details.cart),'products.items':objectId(details.product)},
    //                             {
    //                                 $pull:{products:{items:objectId(details.product)}}
    //                             }
    //                 ).then(()=>{
    //                     resolve({removeProduct:true})
    //                 })
    //         }else{
            
    //             db.get().collection(collection.CART_COLLECTION)
    //             .updateOne({_id:objectId(details.cart),'products.items':objectId(details.product)},
    //                         {
    //                             $inc:{'products.$.quantity':details.count}
    //                         }
            
    //         ).then(()=>{
    //             resolve({status:true})
    //         })
    //     }
    //     })
    
    // },

    // getTotalAmount:(userId)=>{
        
    //     return new Promise(async(resolve,reject)=>{
            
    //         let total=await db.get().collection(collection.CART_COLLECTION)
    //                     .aggregate([
    //                         {
    //                             $match:{user:objectId(userId)}
    //                         },
    //                         {
    //                             $unwind:'$products'
    //                         },
    //                         {
    //                             $project:{
    //                                 item:'$products.items',
    //                                 quantity:'$products.quantity'
    //                             }
    //                         },
    //                         {
    //                             $lookup:{
    //                                 from:collection.PRODUCT_COLLECTION,
    //                                 localField:'item',
    //                                 foreignField:'_id',
    //                                 as:'product'
    //                             }
    //                         },
    //                         {
    //                             $project:{
    //                                 item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
    //                             }
    //                          },
    //                         {
    //                             $group:{
    //                                _id:null,
    //                                 total:{$sum:{ $multiply: [{$toInt:'$quantity'},{$toInt:'$product.Price'}]}}}
    //                         },
    //                         {
    //                             $project:{
    //                                 total:1
    //                             }
    //                         }

    //                     ]).toArray()
    //                     console.log("Total",total);
    //                     if(total){
    //                     resolve(total[0].total)
    //                     }else{
    //                         resolve(0)
    //                     }
                    
    //     })
    // },
    
    // removeFromCart:(proId,userId)=>{
    //     console.log('removee from cart.......................')

       
    // },
    changeProductQuantity:(details)=>{
          details.count=parseInt(details.count)
          details.quantity=parseInt(details.quantity)

          return new Promise((resolve,reject)=>{
              if(details.count==-1 && details.quantity==1){
                  db.get().collection(collection.CART_COLLECTION)
                  .updateOne({_id:objectId(details.cart)},
                  {
                      $pull:{products:{item:objectId(details.product)}}
                  }
                  ).then((response)=>{
                      resolve({removeProduct:true})

                  })

              }
              else
              {
                  db.get().collection(collection.CART_COLLECTION)
                  .updateOne({_id:objectId(details.cart),'products.item':objectId(details.product)},
                  {
                      $inc:{'products.$.quantity':details.count}
                  }
                  
                  
                  ).then((response)=>{
                      resolve({status:true})
                  })
              }
          
      })
    },
    getTotalAmount:(userId)=>{
        console.log('api call')
        return new Promise(async(resolve,reject)=>{
            let total=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                },
                {
                    $group:{
                     _id:null,
                     total:{$sum:{$multiply:['$quantity',{$toInt:'$product.offerAppliedprice'}]}}
                    //  total:{$sum:{$multiply:['$quantity',{$toInt:'$product.price'}]}}
                  
                    }
                },
                {
                    $project:{total:1,_id:0}
                }
              
    
            ]).toArray()
            console.log('total')
            if(total)
            {
          
             resolve(total[0].total)
            }
        })
       
    },
    getSubtotal:(userId)=>{
        console.log('sub total api*****************************************88888')
        return new Promise(async(resolve,reject)=>{
            let total=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                },
                {
                    $project:{
                     
                     total:{$sum:{$multiply:['$quantity',{$toInt:'$product.offerAppliedprice'}]}}
                       //  total:{$sum:{$multiply:['$quantity',{$toInt:'$product.price'}]}}
                  
                    }
                },
                {
                    $project:{total:1,_id:0}
                }
              
    
            ]).toArray()
            console.log('subtotal')
            console.log(total)
            resolve(total)
           
        })

    },
    getCartProductList:(userId)=>{
        return new Promise(async(resolve,reject)=>{

            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(cart)
            {
                resolve(cart.products)
            }

           
       
           
        })
    },
    // placeOrder:(order,products,total,userId)=>{
      
    //      console.log('api call123456')
    //     return new Promise((resolve,reject)=>{
    //         let status=order['payment-method']==='cod'?'placed':'pending'
    //         let shipped='pending'
    //         let orderObj={
    //             deliveryDetails:{

    //                 mobile:order.phonenumber,
    //                 address:order.address,
    //                 pincode:order.pincode,
    //                 username:order.firstName,
    //                 email:order.email

    //             },
    //             userId:objectId(userId),
               
    //             paymentMethod:order['payment-method'],
    //             totalAmount:total,
    //             products:products,
    //             status:status,
    //             date:new Date(),
    //             shipped:shipped
                
    //         }
            
        
    //         db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then(async(response)=>{
          
        
    //          db.get().collection(collection.CART_COLLECTION).remove({user:objectId(userId)})
               
    //             resolve(response.insertedId)
              
    //         })


    //     })
    // },
    deleteCart:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION).remove({user:objectId(userId)})
        })
    },
    
    placeOrder:(order,products,total,userId)=>{
       
         let date=new Date()
        console.log("orderrrrrrrr",order);
        return new Promise( (resolve,reject)=>{
            let status=order['payment-method']==='cod'?'placed':'pending'
            let orderObj={
                delivaryDetails:{
                        name:order.firstName,
                        number:order.phonenumber,
                        email:order.email,
                        address:order.address,
                        pincode:order.pincode,
                        // state:order.state,

                        
                },
                userId:objectId(userId),
                paymentMethod:order['payment-method'],
                product:products,
                totalAmount:total,
                status:status,
                date:date.toDateString()
            }

            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then(async(response)=>{
                // db.get().collection(collection.CART_COLLECTION).deleteOne({user:objectId(userId)})
         
                 

                 resolve(response.insertedId)
            })
        })
    },

    getOrderhistory:(userId)=>{

        return new Promise(async(resolve,reject)=>{
          let orderHistory = await db.get().collection(ORDER_COLLECTION).aggregate([
                {
                    $match:{userId:objectId(userId)}
                },
                {
                    $unwind:'$product'

                },
                {
                    $project:{
                        item:'$product.item',
                        quantity:'$product.quantity',
                        deliveryDetails:'$delivaryDetails',
                        totalAmount:'$totalAmount',
                        paymentMethod:'$paymentMethod',
                        status:'$status',
                        date:'$date',
                       
                        

                    }

                },
                {
                   $lookup:{
                       from:PRODUCT_COLLECTION,
                       localField:'item',
                       foreignField:'_id',
                       as:'product'
                   }
                },
                {
                    $project:{
                    status:1,date:1, paymentMethod:1, totalAmount:1, deliveryDetails:1, item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                },

               


            ]).toArray()
            resolve(orderHistory)
            console.log('api called -orderHistory')
            console.log(orderHistory)
         


        })
    },
    getBanner:()=>{

        return new Promise(async(resolve,reject)=>{
           banner =  await db.get().collection(collection.BANNER_COLLECTION).find().toArray()
           resolve(banner)

        })
    },
   
    generateRazorpay:(orderId,totalAmount)=>{
        console.log("3333333333333333");
        console.log(orderId,totalAmount);
        return new Promise((resolve,reject)=>{
            totalAmount=parseInt(totalAmount)
            var options = {
                amount:totalAmount*100,  // amount in the smallest currency unit
                currency: "INR",
                receipt: orderId.toString()
              };
              instance.orders.create(options, function(err, order) {
                  if(err){
                      console.log(err);
                  }else{   
                console.log("NEW ORDER",order);
                resolve(order)
                  }
              });
        })

    },
    // verifyPayment:(details)=>{
    //     return new Promise((resolve,reject)=>{
    //         const crypto=require('crypto');
    //         const hmac = crypto.createHmac('sha256','5ubC2Tz8EAaxc3sZKGBBHFTd')
    //         hmac.update(details['payment[razorpay_order_id]']+'|'+details['payment[razorpay_payment_id]']);
    //         hmac=hmac.digest('hex')
    //         if(hmac==details[ 'payment[razorpay_signature]']){
    //             resolve()
    //         }
    //         else
    //         {
    //             reject()
    //         }
       
    //     })
    // },
   
    verifyPayment:(data)=>{
        return new Promise((resolve,reject)=>{
           
            const crypto = require('crypto')

            let hmac = crypto.createHmac('sha256', '');

            hmac.update(data['payment[razorpay_order_id]']+'|'+data['payment[razorpay_payment_id]']);

            hmac= hmac.digest('hex')

            if(hmac!=data['payment[razorpay_signature]']){
                resolve()
            }else{
                reject()
            }

        })

    },
//     changePaymentStatus:(orderId)=>{return new Promise((resolve,reject)=>{
//         db.get().collection(collection.ORDER_COLLECTION)
//         .updateOne({_id:objectId(orderId)},
//         {
//             $set:{
//                 status:'placed'
//             }
//         }).then(()=>{
//             resolve()
//         })
//     })
// },
changePaymentStatus:(orderId)=>{
    console.log(orderId)
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
        {
            $set:{status:'placed'}
            
        }).then(()=>{
            resolve()
        })
    })
},

userAddress:(address,userId)=>{
   
    address.user=userId
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.ADDRESSS_COLLECTION).insertOne(address).then((response)=>{
            
        })
    })
},
getUseraddress:(userID)=>{
    return new Promise(async(resolve,reject)=>{
        let address = await db.get().collection(collection.ADDRESSS_COLLECTION).aggregate([
            {
                $match:{user:userID}
            }
        ]).toArray()
           
         
            resolve(address)
          
            
        
    })
},
findAddress:(addresId)=>{
 return new Promise(async(resolve,reject)=>{
    //  let address=await db.get().collection(collection.ADDRESSS_COLLECTION).find({_id:objectId(addresId)}).toArray()
    let address=await db.get().collection(collection.ADDRESSS_COLLECTION).aggregate([
        {
            $match:{_id:objectId(addresId)}
        },
      
    ]).toArray()
    console.log('api:find address')
    console.log(address)

     resolve(address)
 })
},
addTowishlist:(userId,proId)=>{
    
 return new Promise(async(resolve,reject)=>{
    let wishlistexists = await db.get().collection(collection.WISH_LIST).findOne({product:objectId(proId)})
    console.log(wishlistexists)
    if(wishlistexists)
    {
        console.log('product exists')
    }
    else
    {
        let wishlist={
                 user:userId,
                 product:new objectId(proId)
             }
             db.get().collection(collection.WISH_LIST).insertOne(wishlist)
    }
 })
    //  let wishlist={
    //      user:userId,
    //      product:new objectId(proId)
    //  }
    //  db.get().collection(collection.WISH_LIST).insertOne(wishlist)
    
},
 getWishlist:(userId)=>{
     return new Promise(async(resolve,reject)=>{
    let wishlist=  await db.get().collection(collection.WISH_LIST).aggregate([{
           $match:{user:userId},
    },
    {
        $project:{
            item:('$product'),
           
        }

    },
           
            {
                $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                }
            },
            {
                $project:{
                   product:{$arrayElemAt:['$product',0]}
                }
            },

           
         
           


       ]).toArray()
       resolve(wishlist)
       console.log('wish list api...........')
       console.log(wishlist)


     })
 },
 deleteWishlist:(proId)=>{
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.WISH_LIST).remove({product:objectId(proId)}).then(()=>{
            resolve()
        })
    })
},
 userProfile:(uId)=>{
     return new Promise(async(resolve,reject)=>{
         let user = await db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(uId)})
         
         resolve(user)
     })
 },
 findPassword:(userId)=>{
     return new Promise(async(resolve,reject)=>{
      

      let user = await  db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)})

       resolve(user)
     })
 },
 updatePassword:(userId,newPassword)=>{
     return new Promise(async(resolve,reject)=>{
  db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{$set:{password:newPassword}}).then((result)=>{
            resolve()
        })

         })
        
     
     console.log(user)
 },
 deleteAddress:(addressId)=>{
     return new Promise((resolve)=>{
         db.get().collection(collection.ADDRESSS_COLLECTION).remove({_id:objectId(addressId)})
     })
 },
//  placeOrdersaved:(order,products,total,userId)=>{

//     console.log('api:placeordersaved')
//     console.log(order)
//    return new Promise((resolve,reject)=>{
//        let status=order.payment==='cod'?'placed':'pending'
//        let shipped='pending'
//        let orderObj={
//            deliveryDetails:{

//                mobile:order.phonenumber,
//                address:address,
//                pincode:order.pincode,
//                username:order.firstName,
//                email:order.email

//            },
//            userId:objectId(userId),
          
//            paymentMethod:order.payment,
//            totalAmount:total,
//            products:products,
//            status:status,
//            date:new Date(),
//            shipped:shipped
           
//        }
       
   
//        db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
           
//            db.get().collection(collection.CART_COLLECTION).remove({user:objectId(userId)})
//            console.log('response')
//            console.log(response.insertedId)
//            resolve(response.insertedId)
         
//        })

//    })
// },
// savedPlaceorder:(order,products,total,userId)=>{

//     console.log('api called saved place order')
//     return new Promise((resolve,reject)=>{
//                let status=order.payment==='cod'?'placed':'pending'
//                let shipped='pending'
//                let orderObj={
//                    deliveryDetails:{
        
//                        mobile:order.phonenumber,
//                        address:address,
//                        pincode:order.pincode,
//                        username:order.firstName,
//                        email:order.email
        
//                    },
//                    userId:objectId(userId),
                  
//                    paymentMethod:order.payment,
//                    totalAmount:total,
//                    products:products,
//                    status:status,
//                    date:new Date(),
//                    shipped:shipped
                   
//                }
               
           
//                db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
                   
//                    db.get().collection(collection.CART_COLLECTION).remove({user:objectId(userId)})
//                    console.log('response')
//                    console.log(response.insertedId)
//                    resolve(response.insertedId)
                 
//                })
        
//            })
// }
bestsellingCollection:()=>{
    return new Promise(async(resolve,reject)=>{
        let best=await db.get().collection(collection.PRODUCT_COLLECTION).find({category:'BEST SELLING'}).toArray()
        console.log(best)
        resolve(best)
    })
},
menFormalcollection:()=>{
    return new Promise(async(resolve,reject)=>{
     let menFormal = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
        
             {
                 $match:{category:'MEN'}
             },
             {
                 $match:{subcategory:'formal'}
             }
          
        ]).toArray()
        resolve(menFormal)
        console.log('mensformal..',menFormal)
    })
},
womenFormalcollection:()=>{
    return new Promise(async(resolve,reject)=>{
     let menFormal = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
        
             {
                 $match:{category:'WOMEN'}
             },
             {
                 $match:{subcategory:'formal'}
             }
          
        ]).toArray()
        resolve(menFormal)
        console.log('mensformal..',menFormal)
    })
},

menCasualcollection:()=>{
    return new Promise(async(resolve,reject)=>{
     let menFormal = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
        
             {
                 $match:{category:'MEN'}
             },
             {
                 $match:{subcategory:'casual'}
             }
          
        ]).toArray()
        resolve(menFormal)
        console.log('mensformal..',menFormal)
    })
},
searchProduct:(item)=>{
    return new Promise(async(resolve,reject)=>{
       let data= await db.get().collection(collection.PRODUCT_COLLECTION).find({title:{$regex: item, $options: 'i'}}).toArray()
            console.log(data);
            resolve(data)
      
    })
},
findSavedaddress:(addressId)=>{
    return new Promise(async(resolve,reject)=>{

        let address = await db.get().collection(collection.ADDRESSS_COLLECTION).findOne({_id:objectId(addressId)})
        resolve(address)
    })
},
updateAddress:(data,addressId)=>{
    return new Promise((resolve,reject)=>{
         db.get().collection(collection.ADDRESSS_COLLECTION)
                        .updateOne({_id:objectId(addressId)},{
                            $set:{
                                firstName:data.firstName,
                                lastName:data.lastName,
                                country: data.country,
                                address : data.address,
                                city : data.city,
                                state : data.state,
                                pincode : data.pincode,
                                phonenumber : data.phonenumber,
                                email : data.email,

                            }

                               }).then((response)=>{
                                      resolve()

                            })
    })

    



},
 paypalOrder:(orderId)=>{
     return new Promise((resolve,reject)=>{
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},{$set:{status:'placed'}}).then((result)=>{
            resolve()
        })
     })
 },
 updateprofileInfo:(userId,data)=>{
     return new Promise((resolve,reject)=>{
        db.get().collection(collection.USER_COLLECTION).updateMany({_id:objectId(userId)},{$set:{email:data.email,name:data.name,phonenumber:data.phonenumber}}).then((result)=>{
            resolve()
        })

     })
 },


        }

    

       
     
    
    

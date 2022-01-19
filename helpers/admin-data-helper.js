let db=require('../config/connection')
let collection=require('../config/collection')
 
let objectId=require('mongodb').ObjectId
const { PRODUCT_COLLECTION } = require('../config/collection')

module.exports={
    adminLogin:(loginData)=>{
        
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.ADMIN_COLLECTION).findOne({email:loginData.email,password:loginData.password}).then((data)=>{
                console.log(data);
                resolve(data)
            })
        })
    },
    getProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            // let date = new Date();
            // let offer = await adminHelper.getOffer()
            // let dd = String(date.getDate()).padStart(2, '0');
            // let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
            // let yyyy = date.getFullYear();
            
            // date =  yyyy + '-' + mm + '-' + dd;
            db.get().collection(collection.PRODUCT_COLLECTION).updateMany({},{$set:{isPricechange:false}}).then(()=>{
              
            })
           
            let productDetails =await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
    //         for(let i = 0;i<productDetail.length;i++)
    // {
    // if(productDetail[i]. > date){
    //   offer[i].validity=true
  
      
    // }
    // console.log('test...................................//?????',productDetails[i].)
            
           
           
             for(let i=0;i<productDetails.length;i++)

             {
                 
                 console.log("inside forloop")
                 
              
                 if(productDetails[i].productOffer && productDetails[i].categoryOffer)
                 {   console.log('first test............................')
                     if(productDetails[i].productOffer.discount>= productDetails[i].categoryOffer.discount)
                     {
                        console.log('first test............................')
                         let discount = productDetails[i].price*(productDetails[i].productOffer.discount)/100
                         let offerAppliedprice = productDetails[i].price - discount
                         db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:productDetails[i]._id},{$set:{offerAppliedprice :offerAppliedprice,isPricechange:true}}).then((result)=>{
                          
                        })

                     }
                 
                    else{
                        console.log('dsecond test............................')
                        let discount = productDetails[i].price*(productDetails[i].categoryOffer.discount)/100
                        let offerAppliedprice = productDetails[i].price - discount
                        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:productDetails[i]._id},{$set:{offerAppliedprice :offerAppliedprice,isPricechange:true}}).then((result)=>{
                           
                       })

                    

                 }
                }
                else if(productDetails[i].productOffer || productDetails[i].categoryOffer)
                {
                    console.log('third test............................')
                    if(productDetails[i].productOffer)
                    { 
                        console.log('fourth test............................')
                        let discount1 = (productDetails[i].productOffer.discount) 
                        console.log(productDetails[i].productOffer.discount)
                        let discount = (productDetails[i].price)*(discount1)/100
                        let offerAppliedprice = productDetails[i].price - discount
                        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:productDetails[i]._id},{$set:{offerAppliedprice :offerAppliedprice ,isPricechange:true}}).then((result)=>{
                   
                        })
                         


                    }
                    else
                    {
                        console.log('fifth test............................')
                       
                        let discount = productDetails[i].price*(productDetails[i].categoryOffer.discount)/100
                        let offerAppliedprice = productDetails[i].price - discount
                        db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:productDetails[i]._id},{$set:{offerAppliedprice :offerAppliedprice,isPricechange:true}}).then((result)=>{
                          console.log("product id........................",productDetails[i]._id)
                       })


                    }

                    
                }
                else
                {
                    db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:productDetails[i]._id},{$set:{offerAppliedprice :productDetails[i].price}}).then((result)=>{
                        console.log("product id........................",productDetails[i]._id)
                     })
                }
             }
             
           upadtedProducts = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
           
            
            resolve( upadtedProducts)
            
        })
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let usersDetails =await db.get().collection(collection.USER_COLLECTION).find().toArray()
            
            resolve(usersDetails)
            
        })
    },
    createProduct:(products)=>{
        return new Promise((resolve,reject)=>{
            let product={
                title:products.title,
                description:products.description,
                 category:products.category,
                 subCategory:products.subcategory,
                 price:products.price
            }
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((id)=>{
                resolve(id.insertedId)
            })
        })
    },
    blockUsers:(userId)=>{
        return new Promise(async(resolve,reject)=>{
           
           
        //    if(result.blockUsers){
        //     db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{$unset:{blockUsers:true}}).then((result)=>{
        //         resolve()
        //     })

        //    }else{

               db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{$set:{blockUsers:true}}).then((result)=>{
                   resolve()
               })

            //    db.get().collection(collection.USER_COLLECTION).aggregate(
            //     [{
            //         $match :
            //         {_id:objectId(userId) },
            //                 $cond:{
            //                         if:{$exist:"$blockUsers"},
            //                         then:{$unset:{blockUsers:1}},
            //                         else:{$set:{blockUsers:true}}
            //                      },as:'result'
                                
            //     }]).toArray(()=>{

            //         resolve(result)
            //     })
           
        })
    },

    unBlockUsers:(userId)=>{
        return new Promise((resolve,reject)=>{
            

                db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{$unset:{blockUsers:true}}).then((result)=>{
                    resolve()
                })
           

        })
    },



    deleteUsers:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.USER_COLLECTION).remove({_id:objectId(userId)}).then(()=>{
                resolve()
            })
        })
    },

    deleteProduct:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).remove({_id:objectId(proId)}).then((response)=>{
                resolve(response)
            })
        })

    },
    getProductDetails:(proId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{

                    resolve(product)
                })
            })
        },
        updateProduct:(proId,products)=>{
            return new Promise((resolve,reject)=>{
                 db.get().collection(collection.PRODUCT_COLLECTION)
                                .updateOne({_id:objectId(proId)},{
                                    $set:{
                                        title:products.title,
                                        description:products.description,
                                        //  category:products.category,
                                        //  subCategory:products.subcategory,
                                         price:products.price
    
                                    }
    
                                       }).then((response)=>{
                                              resolve()
    
                                    })
            })

            
        

  
        },
        addCategory:(categoryDetail)=>{
            categoryDetail.subCategory=[]

            return new Promise((resolve,reject)=>{
                db.get().collection(collection.ADMIN_CATEGORY).insertOne(categoryDetail).then((insertedId)=>{
                    resolve()
                })
            })
        },
        allCategories:()=>{
            return new Promise(async(resolve,reject)=>{
               let categories= await db.get().collection(collection.ADMIN_CATEGORY).find().toArray()
                    resolve(categories)
                
            })
        },
        findCategories:(categoryId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.ADMIN_CATEGORY).findOne({_id:objectId(categoryId)}).then((data)=>{
                    resolve(data)
                })
            })
        },
        editCategories:(categoryId,details)=>{
            console.log(categoryId);
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.ADMIN_CATEGORY).updateOne({_id:objectId(categoryId)},{$set:{category:details.category}}).then((data)=>{
                    resolve()
                })
            })
        },
        deleteCategories:(categoryId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.ADMIN_CATEGORY).deleteOne({_id:objectId(categoryId)}).then(()=>{
                    resolve()
                })
            })
        },
        addSubCategory:(categoryId,subCategoryDetail)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.ADMIN_CATEGORY)
                .updateOne({_id:objectId(categoryId)},{$push:{subCategory:subCategoryDetail}}).then(()=>{
                    resolve()
                })
            })
        },

        deleteSubCategory:(id,subCategoryName)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.ADMIN_CATEGORY).updateOne({_id:objectId(id)},
                {$pull:{subCategory:{name:subCategoryName}}}).then((data)=>{
                    resolve(data)
                })
            })
        },

        getSubCategory:(categoryName)=>{
            console.log('subcategory api.............')
            return new Promise(async(resolve,reject)=>{
                let data= await db.get().collection(collection.ADMIN_CATEGORY). aggregate([{$match:{category:categoryName.category}},
                    {
                        $unwind:'$subCategory'
                    },
                    {
                        $project:{
                            
                            name:'$subCategory.name',
                            
                        }
                    },
                    {
                        $project:{
                            name:1,_id:0
                        }
                    }
                    ]).toArray()
                
                
                
                console.log('data from subcategory........')
                 console.log(data);
                resolve(data)
            })
                
        },
        getsubcategoryDetails:(cId,cName)=>{
            return new Promise(async(resolve,reject)=>{
              let data = await db.get().collection(collection.ADMIN_CATEGORY).aggregate([{$match:{_id:objectId(cId)}},

                {$unwind:'$subCategory'},

                {
                    $project:{name:'$subCategory.name',
                    // dimensions: { $arrayToObject: "$dimensions" }
                
                
                },
                    
                },
                {$match:{name:cName}},

                {
                    $project:{
                        name:1,_id:0
                    }
                }

              
                
               

        
            
            
            
            ]).toArray()
            console.log('server data')
            console.log(data)
               resolve(data)
            })

        },

        updateSubcategory:(cId,cName)=>{
            return new Promise((resolve,reject)=>{

            })


        },

        getOrderhistory:()=>{
            return new Promise(async(resolve,reject)=>{
                let orderHistory = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                     
                      {
                          $unwind:'$product'
      
                      },
                      {
                          $project:{
                              item:'$product.item',
                              quantity:'$product.quantity',
                              delivaryDetails:'$delivaryDetails',
                              totalAmount:'$totalAmount',
                              paymentMethod:'$paymentMethod',
                              status:'$status',
                              date:'$date',
                             
                              
      
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
                         status:1,date:1, paymentMethod:1, totalAmount:1,  delivaryDetails:1, item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                          }
                      },
      
                     
      
      
                  ]).toArray()
                  resolve(orderHistory)
                  console.log('api called -orderHistory')
                  console.log(orderHistory)
               
      
      
              })

           


            
        },
      
        approve:(orderId)=>{
          
            console.log('api call')
            console.log(orderId)
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
            {
                $set:{status:'shipped'}
            }
            
            )
    

        },
        reject:(orderId)=>{
         
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
            {
               $set:{status:'cancelled'}

            })

        },

        delivered:(orderId)=>{
            db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},

            {
                $set:{status:'delivered'}
            }
            
            
            )
        },
        createBanner:(banner)=>{
           return new Promise((resolve,reject)=>{
               db.get().collection(collection.BANNER_COLLECTION).insertOne(banner).then((id)=>{
                   resolve(id.insertedId)
               })
           })

        },
        deleteBanner:(bannerId)=>{
            return new Promise((resolve,reject)=>{
            
                db.get().collection(collection.BANNER_COLLECTION).remove({_id:objectId(bannerId)}).then((response)=>{
                    resolve(response)
                })

            })
        },
        totalOrderCompletedCount:()=>{
            return new Promise(async(resolve,reject)=>{
                let complete = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    
                    {
                        $match: { status: 'placed' }
                    },
                    {
                        $group: {_id: "$date", count: { $sum: 1 } }
                    },
                    {$sort : {_id : 1 }}

                ]).toArray()
                
                if(complete){
                    resolve(complete)
                    console.log(complete)
                }else{
                    resolve(null)
                }
               
            })
        },
        totalOrderpending:()=>{
            return new Promise(async(resolve,reject)=>{
                let complete = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    
                    {
                        $match: { status: 'pending' }
                    },
                    {
                        $group: {_id: "$date", count: { $sum: 1 } }
                    },
                    {$sort : {_id : 1 }}

                ]).toArray()
                
                if(complete){
                    resolve(complete)
                    console.log(complete)
                }else{
                    resolve(null)
                }
               
            })
        },
        // totalOrderPending:()=>{
        //     return new Promise(async(resolve,reject)=>{
        //         let complete = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    
        //             {
        //                 $match: { status: 'pending' }
        //             },
        //             {
        //                 $group: {_id: "$date", count: { $sum: 1 } }
        //             },
        //             {$sort : {_id : 1 }}

        //         ]).toArray()
                
        //         if(complete){
        //             resolve(complete)
        //             console.log(complete)
        //         }else{
        //             resolve(null)
        //         }
               
        //     })
        // },
        totalOrderCancelled:()=>{
            return new Promise(async(resolve,reject)=>{
                let complete = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    
                    {
                        $match: { status: 'cancelled' }
                    },
                    {
                        $group: {_id: "$date", count: { $sum: 1 } }
                    },
                    {$sort : {_id : 1 }}

                ]).toArray()
                
                if(complete){
                    resolve(complete)
                    console.log(complete)
                }else{
                    resolve(null)
                }
               
            })
        },
    

        addCoupon:(couponData)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.COUPON_COLLECTION).insertOne(couponData)
            })
        },
        getCoupondata:()=>{
            return new Promise(async(resolve,reject)=>{
                let couponData=await db.get().collection(collection.COUPON_COLLECTION).find({}).toArray()

                resolve(couponData)
            })
        },
        couponvalidityCheck:(code)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.COUPON_COLLECTION).findOne({couponCode:code}).then((response)=>{
                    console.log('coupon api ............')

                   
                   
                    resolve(response)

                    console.log('api response',response)
                }

                )
            })

        },
        addOffer:(offerData)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.OFFER_COLLECTION).insertOne(offerData)
            })
        },
        getOffer:()=>{
            return new Promise(async(resolve,reject)=>{
             let offerList = await db.get().collection(collection.OFFER_COLLECTION).find({}).toArray()
             resolve(offerList)
            })
        },

         addProductoffer:(offerId,productId)=>{
             return new Promise(async(resolve,reject)=>{
                 let productOffer= await db.get().collection(collection.OFFER_COLLECTION).findOne({_id:objectId(offerId)})
                 let product= await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(productId)})
                 console.log(product)
                //  let offerName=offer.offerName
                //  let expiry=offer.expiry
                //  let discount=offer.discount
                 db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(productId)},{$set:{productOffer:productOffer}}).then((result)=>{
                    resolve()
                })
                 console.log('addproduct api')
                  console.log(offer)


             })
         },
         addCategoryoffer:(offerId,cId)=>{
             console.log('api call add category offer')
            
             return new Promise(async(resolve,reject)=>{
                let category = await db.get().collection(collection.ADMIN_CATEGORY).findOne({_id:objectId(cId)})
                let categoryOffer = await db.get().collection(collection.OFFER_COLLECTION).findOne({_id:objectId(offerId)})
                db.get().collection(collection.ADMIN_CATEGORY).updateOne({_id:objectId(cId)},{$set:{categoryOffer:categoryOffer}}).then((result)=>{
                    resolve()
                })
                categoryName=category.category
                db.get().collection(collection.PRODUCT_COLLECTION).updateMany({category:categoryName},{$set:{categoryOffer:categoryOffer}}).then((result)=>{
                    resolve()
                })

             })
         },
                 totalRevenue:()=>{
            return new Promise(async(resolve,reject)=>{
              let orderTotal = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                  {
                      $match:{status:"placed"}
                  },
                  
                {
                 $group: {
                    _id: "",
                    "totalAmount": { $sum: '$totalAmount' }
                 }
                 }, 
                 {
                    $project: {
                       _id: 0,
                       "TotalOrderAmount": '$totalAmount'
                    }
              }]).toArray()
               
              console.log("total_Price_Of_Total_Orders_For_Dashboard",orderTotal)
                resolve(orderTotal[0].TotalOrderAmount)
            })
        },
        totalNoOfOrders:()=>{
            return new Promise(async(resolve,reject)=>{
               let count= await db.get().collection(collection.ORDER_COLLECTION).count()
              
               resolve(count)
            })
        },
        totalNoOfProducts:()=>{
            return new Promise(async(resolve,reject)=>{
               let count= await db.get().collection(collection.PRODUCT_COLLECTION).count()
              
               resolve(count)
            })
        },
        totalOrderplaced:()=>{
            return new Promise(async(resolve,reject)=>{
                let count = await db.get().collection(collection.ORDER_COLLECTION).find({status:'placed'}).count()
                resolve(count)
            })

        },
        getAllOrders:(sortMethod)=>{
            return new Promise(async(resolve,reject)=>{
                
                if(sortMethod=='date'){

                    console.log("date");

                    let orders= await db.get().collection(collection.ORDER_COLLECTION).find().sort({fullDateWithTime:-1}).toArray()
                    resolve(orders)
                }else if(sortMethod=='week'){

                    console.log("week");

                    let orders= await db.get().collection(collection.ORDER_COLLECTION).aggregate(
                        [
                          {
                            $addFields:
                              {
                                
                                week: { $week: "$fullDateWithTime" }
                              }
                          }
                        ]
                     ).sort({week:-1}).toArray()
                    //  console.log(orders);
                     resolve(orders)

                }else if(sortMethod=='month'){

                    console.log("week");

                    let orders= await db.get().collection(collection.ORDER_COLLECTION).aggregate(
                        [
                          {
                            $addFields:
                              {
                                
                                month: { $month: "$fullDateWithTime" }
                              }
                          }
                        ]
                     ).sort({month:-1}).toArray()
                    //  console.log(orders);
                     resolve(orders)
                }
                
                
                
                else{

                    console.log("normal");

                    let orders= await db.get().collection(collection.ORDER_COLLECTION).find().toArray()
                   
                    resolve(orders)
                }
                    
                
            })
        },
        removeProductOffer:(productId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(productId)},{$unset:{productOffer:""}}).then(()=>{
                      
                        resolve()

                })
            })
        },
        removeCategoryOffer:(categoryId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.PRODUCT_COLLECTION).updateMany({},{$unset:{categoryOffer:""}}).then(()=>{
                    db.get().collection(collection.ADMIN_CATEGORY).updateOne({_id:objectId(categoryId)},{$unset:{categoryOffer:""}}).then(()=>{
        
                        resolve()
                    })
                })
            })
        },

        deleteCoupon:(couponId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.COUPON_COLLECTION).deleteOne({_id:objectId(couponId)})
            })
        },
        deleteOffer:(couponId)=>{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.OFFER_COLLECTION).deleteOne({_id:objectId(couponId)})
            })
        },

        getAllOrdersForDashboard:()=>{
            return new Promise(async(resolve,reject)=>{
                let orders= await db.get().collection(collection.ORDER_COLLECTION).find().limit(5).sort({fullDateWithTime:-1}).toArray()
                resolve(orders)
            })
        },
        getTopPayment:()=>{
            return new Promise(async (resolve,reject)=>{
                let payments= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                     {
                         $match:{
                             status:"placed"
                         }
                     },
                     {
                         $group:{
                             _id:"$paymentMethod",
                             count : {$sum : 1}  
                         }
                     }
             ]).toArray()
 
             var paymentMethod = [];
                  var count = [];
   
                  payments.forEach((item)=>{
                       
                       paymentMethod.push(item._id);
                       count.push(item.count);
                  })
                  console.log("paymentMethod ",paymentMethod);
                  console.log("count ",count);
 
             
 
             resolve({
                 paymentMethods: paymentMethod,
                 counts: count
             })
 
            })
        },
        getTopSellingCategory:()=>{
            return new Promise(async (resolve,reject)=>{
                let payments= await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                     {
                         $match:{
                             status:"delivered"
                         }
                     },
                     {
                         $group:{
                             _id:"$product.item",
                             count : {$sum : 1}  
                         }
                     }
             ]).toArray()
 
             var paymentMethod = [];
                  var count = [];
   
                  payments.forEach((item)=>{
                       
                       paymentMethod.push(item._id);
                       count.push(item.count);
                  })
                  console.log("paymentMethod ",paymentMethod);
                  console.log("count ",count);
 
             
 
             resolve({
                 paymentMethods: paymentMethod,
                 counts: count
             })
 
            })
        },
        searchProductadmin:(item)=>{
            return new Promise(async(resolve,reject)=>{
               let data= await db.get().collection(collection.PRODUCT_COLLECTION).find({title:{$regex: item, $options: 'i'}}).toArray()
                    console.log(data);
                    resolve(data)
              
            })
        },
       

       








         
                
            




}
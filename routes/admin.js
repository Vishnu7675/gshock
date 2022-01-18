var express = require('express');
const { Db } = require('mongodb');
const collection = require('../config/collection');
const adminDataHelper = require('../helpers/admin-data-helper');
var router = express.Router();
var adminHelper= require('../helpers/admin-data-helper')
var userHelper=require('../helpers/user-data-helper')
var fs=require('fs')
var cc = require('coupon-code');
const { redirect } = require('express/lib/response');


var loginStatus={}
router.get('/getDate',async(req,res)=>{
  let data = await adminDataHelper.totalOrderCompletedCount()
console.log('client data',data)

res.json(data)
})
router.get('/', async function (req, res) {
  if(req.session.admin)
  {
   console.log('admin dashboard test...............')
   let placed =await  adminHelper.totalOrderCompletedCount()
   let totalRevenue  = await adminHelper.totalRevenue()
   let totalOrder = await adminHelper.totalNoOfOrders()
   let totalProduct = await adminHelper.totalNoOfProducts()
   let placedCount = await adminHelper.totalOrderplaced()
   let orders = await adminHelper.getAllOrdersForDashboard()
   console.log(orders)
   console.log(totalRevenue )
   console.log('placed',placed)
     res.render('admin/dashboard',{admin:true,totalRevenue,totalOrder,totalProduct,placedCount,orders})
    
   
  }
  else{
    console.log(loginStatus)
    res.render('admin/admin-login',loginStatus)
  }
});
router.get('/admin-dashboard',(req,res)=>{
  console.log('admin dashboard.....................................')
  if(req.session.admin)
  {
   
   
  res.render('admin/dashboard',{admin:true})
  }
  else
  {
    res.redirect('admin/admin-login')
  }
})
router.get('/admin-products',async(req,res)=>{

  

  if(req.session.admin)
  {
    let date = new Date();
    let offer = await adminHelper.getOffer()
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    
    date =  yyyy + '-' + mm + '-' + dd;
    console.log('modified date',date)
   
    for(let i = 0;i<offer.length;i++)
    {
    if(offer[i].expiry > date){
      offer[i].validity=true
  
      
    }
    console.log(offer)
  }
   adminHelper.getProducts().then((allUsers)=>{
 
      res.render('admin/admin-products',{admin:true,allUsers,offer})
    
  })
  }
  else
  {
    res.redirect('admin-login')
  }
})
router.get('/admin-addproduct',(req,res)=>{
  if(req.session.admin)
  {
    adminHelper.allCategories().then((categoryDetails)=>{
      console.log(categoryDetails)
      
      res.render('admin/admin-addproduct',{admin:true,categoryDetails})
    })
  
  }
  else
  {
    res.redirect('admin/admin-login')
  }
})
router.post('/admin-addproduct',(req,res)=>{
  console.log('add product....................')
console.log(req.body.title)
 

  adminHelper.createProduct(req.body).then((id)=>{
    console.log(id)
    let image1 = req.body.image1_b64

    let path1 = "./public/" + id + "_1.jpg"

    let img1 = image1.replace(/^data:([A-Za-z+/]+);base64,/, "")

    fs.writeFileSync(path1, img1, { encoding: 'base64' })



    let image2 = req.body.image2_b64

    let path2 = "./public/" + id + "_2.jpg"

    let img2 = image2.replace(/^data:([A-Za-z+/]+);base64,/, "")

    fs.writeFileSync(path2, img2, { encoding: 'base64' })



    let image3 = req.body.image3_b64

    let path3 = "./public/" + id + "_3.jpg"

    let img3 = image3.replace(/^data:([A-Za-z+/]+);base64,/, "")

    fs.writeFileSync(path3, img3, { encoding: 'base64' })
    

    res.redirect('/admin/admin-addproduct')
  









  })
  //   console.log(id)
  //   var image=req.files.image
  //   var image1=req.files.image1
  //   var image2=req.files.image2
  //   var image3=req.files.image3
  //   image1.mv('./public/'+id+'1.jpg')
  //   image2.mv('./public/'+id+'2.jpg')
  //   image3.mv('./public/'+id+'3.jpg')

  //   image.mv('./public/'+id+'.jpg',(err)=>{
  //     if(!err)
  //     {
  //       res.redirect('/admin/admin-products')
  //     }
  //     else
  //     {
  //       console.log(err)
  //     }
  //   })
    
  //   // res.redirect('/admin')


 
})
// router.post('/admin-addproduct',(req,res)=>{
//   adminHelper.createProduct(req.body).then((id)=>{
//     let image=req.files.image
//     image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
//       console.log(id);
//       if(!err){
//         res.redirect('/admin/admin-products')

//       } else{
//         console.log(err);
//       }
      
//     })
//   })
// })
router.get('/admin-userlist',(req,res)=>{
  adminHelper.getAllUsers().then((allUsers)=>{
    res.render('admin/admin-userlist',{admin:true,allUsers})
   })
  

 

})
router.get('/delete-user/:id',(req,res)=>{

  adminHelper.deleteUsers(req.params.id).then(()=>{
    res.redirect('/admin/admin-userlist')
   

  })

})

router.post('/admin-login',(req,res)=>{
  console.log(req.body)
   adminHelper.adminLogin(req.body).then((admin)=>{
     console.log(admin)

     if(admin)
     {
      if(admin.email==req.body.email && admin.password==req.body.password)
      {
        req.session.admin=admin
        res.redirect('/admin')

      }
      else
      {
        loginStatus.err=true
        res.redirect('/admin')
      }
     }
     else{
       res.redirect('/admin')
     }


   })

})
router.get('/block-user/:id',(req,res)=>{
  console.log('userid'+req.params.id)
  let docId=req.params.id
  adminHelper.blockUsers(docId).then((result)=>{
    console.log("datbase id"+req.session.user._id)
    if(req.session.user._id===req.params.id)
    {
      req.session.user=null

    }
 
    
    res.redirect('/admin/admin-userlist')
  })
})

router.get('/unblock-user/:id',(req,res)=>{
  let docId=req.params.id
  adminHelper.unBlockUsers(docId).then((result)=>{
    res.redirect('/admin/admin-userlist')
  })
})
router.get('/admin-logout',(req,res)=>{
 req.session.admin=null
 res.redirect('/admin')

})
router.get('/delete-user/:id',(req,res)=>{

 adminHelper.deleteUsers(req.params.id).then(()=>{
  
   res.redirect('/admin')

 })

})
router.get('/delete-product',(req,res)=>{
  let proId=req.query.proId
  adminHelper.deleteProduct(proId).then((Response)=>{
    res.redirect('/admin/admin-products')
    
  })

}

)
router.get('/edit-product/:id',async(req,res)=>{
  let proId=req.params.id
  let product =await adminHelper.getProductDetails(proId)
  console.log(product);
  res.render('admin/edit-product',{admin:true,product})
})
router.post('/edit-product/:id',(req,res)=>{
  // console.log(req.body)

  let proId=req.params.id
  adminHelper.updateProduct(proId,req.body).then(()=>{
    res.redirect('/admin/admin-products')

    if(req.body.image1_b64){
    //   let image=req.files.image
    //   image.mv('./public/'+req.params.id+'.jpg')

    // 
    console.log('first image edited')
    let image1 = req.body.image1_b64

    let path1 = "./public/" + proId + "_1.jpg"

    let img1 = image1.replace(/^data:([A-Za-z+/]+);base64,/, "")

    fs.writeFileSync(path1, img1, { encoding: 'base64' })
  }
  
  if(req.body.image2_b64){
    //   let image=req.files.image
    //   image.mv('./public/'+req.params.id+'.jpg')

    // 
    let image2 = req.body.image2_b64

    let path2 = "./public/" + proId + "_2.jpg"

    let img2 = image2.replace(/^data:([A-Za-z+/]+);base64,/, "")

    fs.writeFileSync(path2, img2, { encoding: 'base64' })
  }
  if(req.body.image3_b64){
    //   let image=req.files.image
    //   image.mv('./public/'+req.params.id+'.jpg')

    // 
    let image3 = req.body.image3_b64

    let path3 = "./public/" + proId + "_3.jpg"

    let img3 = image3.replace(/^data:([A-Za-z+/]+);base64,/, "")

    fs.writeFileSync(path3, img3, { encoding: 'base64' })
  }
  
  })

})
router.get('/category',async(req,res)=>{
  // let offer = await adminHelper.getOffer()
  let date = new Date();
    let offer = await adminHelper.getOffer()
    let dd = String(date.getDate()).padStart(2, '0');
    let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = date.getFullYear();
    
    date =  yyyy + '-' + mm + '-' + dd;
    console.log('modified date',date)
   
    for(let i = 0;i<offer.length;i++)
    {
    if(offer[i].expiry < date){
      offer[i].validity=true
  
      
    }
    console.log(offer)
  }
  adminHelper.allCategories().then((categoryDetails)=>{
    console.log(categoryDetails)
    
    res.render('admin/category',{admin:true,categoryDetails,offer})
  })
})

router.get('/add-category',(req,res)=>{
  adminHelper.allCategories().then((categoryDetails)=>{
    
    res.render('admin/add-category',{admin:true,categoryDetails})
  })
})   

router.post('/add-category',(req,res)=>{
 
 
  
  adminHelper.addCategory(req.body).then(()=>{
    res.redirect('/admin/add-category')
  })
})
router.get('/edit-category/:id',(req,res)=>{
  
  adminHelper.findCategories(req.params.id).then((categoryDetail)=>{
    // console.log(categoryDetail)
    adminHelper.allCategories().then((allCategories)=>{
      res.render('admin/edit-category',{admin:true,categoryDetail,allCategories})
    })
  })
})
router.post('/edit-category/:id',(req,res)=>{

  let categoryId= req.params.id
  console.log(categoryId);
  console.log(req.body);
  adminHelper.editCategories(categoryId,req.body).then(()=>{
    res.redirect('/admin/category')
  })
})
router.get('/delete-category/:id',(req,res)=>{
  let categoryId=req.params.id
  adminHelper.deleteCategories(categoryId).then(()=>{
    res.redirect('/admin/category')
  })
})
router.get('/sub-category/:id', async(req,res)=>{
 
  let categoryId=req.params.id
  let categoryDetail = await adminHelper.findCategories(categoryId)
  let subCategory=categoryDetail.subCategory
  console.log('sub categorytest')
  console.log(subCategory)
  
  console.log(categoryDetail)
  res.render('admin/sub-category',{admin:true,subCategory,categoryDetail})
  console.log(subCategory)

})

router.get('/add-sub-category/:id',async(req,res)=>{
  console.log("add sub category");
  console.log(req.params.id);
  let category= await adminHelper.findCategories(req.params.id)
  
  // let subCategories= category.subCategory
  console.log("find");
    console.log(category);
    res.render('admin/add-sub-category',{admin:true,category})

})

router.post('/post-add-sub-category/:id',(req,res)=>{
  console.log(req.params.id);
  console.log(req.body);
  console.log(req.body)
  adminHelper.addSubCategory(req.params.id,req.body).then(()=>{
    res.render('admin/category',{admin:true})
  })
})

router.get('/deletesubcategory',(req,res)=>{
  cId=req.query.sub
  cName=req.query.name
  adminHelper.deleteSubCategory(cId,cName).then(()=>{
    console.log('subcategoryname')
    console.log(req.query.name)
    // res.send('deletesub category')
    // res.redirect('/admin/sub-category')
    res.render('admin/sub-category',{admin:true})

  })
 



})

router.post('/get-sub-category',(req,res)=>{

  console.log('get sub category')
  
  adminHelper.getSubCategory(req.body).then((response)=>{
    console.log('sub category....................................')
    console.log(response)


    res.json(response)

  })

})


router.get('/dashboard',async(req,res)=>{
let totalRevenue  = await adminHelper.totalRevenue()
console.log('total revenue',totalRevenue)
 res.render('admin/dashboard',{admin:true,totalRevenue})
 
  
})
router.get('/editsubcategory',async(req,res)=>{
    let cId=req.query.sub
    let cName=req.query.name

 
    let sub = await adminHelper.getsubcategoryDetails(cId,cName)
    console.log('sub')
    console.log(sub)
   res.render('admin/edit-subcategory',{sub})


    


})
router.get('/banner',async(req,res)=>{
 
  let banner = await userHelper.getBanner()
  res.render('admin/banner',{admin:true,banner})

})
router.get('/addbanner',(req,res)=>{
  res.render('admin/add-banner',{admin:true})
})
router.post('/addbanner',(req,res)=>{
  console.log(req.files)
  adminHelper.createBanner(req.body).then((id)=>{
    var banner = req.files.banner
    banner.mv('./public/'+id+'.jpg',(err)=>{
      if(!err)
      {
        res.render('admin/banner',{admin:true,banner})
      }
      else
      {
        console.log(err)
      }
    })
  })

  // adminHelper.createProduct(req.body).then((id)=>{
  //   console.log(id)
  //   var image=req.files.image
  //   var image1=req.files.image1

  //   image1.mv('./public/'+id+'1.jpg')


  //   image.mv('./public/'+id+'.jpg',(err)=>{
  //     if(!err)
  //     {
  //       res.redirect('/admin/admin-products')
  //     }
  //     else
  //     {
  //       console.log(err)
  //     }
  //   })
  
    
 
 


})
router.get('/ordermanagement',async(req,res)=>{
  let orders=await adminHelper.getOrderhistory()

  console.log(orders)
 
  res.render('admin/order-management',{admin:true,orders})
})
router.get('/approve/:id',(req,res)=>{
   

  let orderId=req.params.id
  console.log(orderId)
  adminHelper.approve(orderId)
  res.redirect('/admin/ordermanagement')

 


})
router.get('/reject/:id',(req,res)=>{
  let orderId = req.params.id
   
  adminHelper.reject(orderId)
  res.redirect('/admin/ordermanagement')

  
  

})
router.get('/delivered/:id',(req,res)=>{
  
  let orderId=req.params.id

  adminHelper.delivered(orderId)
  res.redirect('/admin/ordermanagement')

})
router.get('/delete-banner',(req,res)=>{
  let bannerId=req.query.bannerId
  console.log('88888888888888888888888',bannerId)

  // let bannerId = req.query.bannerId

  adminHelper.deleteBanner(bannerId).then((data)=>{
    res.json({})
    

  })

  
})
router.get('/totalOrderpending',async(req,res)=>{
  let pending=await adminHelper.totalOrderpending()
  res.json(pending)
})
router.get('/totalOrdercancelled',async(req,res)=>{
  let cancelled=await adminHelper.totalOrderCancelled()
  res.json(cancelled)
})

//offer


// offer
// router.get('/categoryOffer',verifyLogin,async(req,res)=>{
//   var allCates =await offerAndCouponHelpers.showAllNoCategoryOffers()
//   await offerAndCouponHelpers.showAllCategoryOffer().then((allOffers)=>{
//       res.render('admin/categoryOffer',{admin:1,allOffers,allCates})
//   })
// })

// // add new Offer
// router.post('/addNewcategoryOffer',(req,res)=>{
//   console.log(req.body.category);
//   offerAndCouponHelpers.addCategoryOffer(req.body.category,req.body).then((response)=>{
//       console.log(response);
//       res.json(response)
//   }).catch((err)=>{
//       console.log(err);
//       res.json(err)
//   })
// })

// // delete category offer 
// router.post('/deleteCategoryOffer',(req,res)=>{
//   console.log(req.body.offerId);
//   offerAndCouponHelpers.deleteCategoryOffer(req.body.offerId,req.body.catename).then((response)=>{
//       console.log(response);
//       res.json(response)
//   }).catch((err)=>{
//       console.log(err);
//       res.json(err)
//   })
// })

// // add category offer in category
// // router.post('/categoryAddCategoryOffer',(req,res)=>{
// //     console.log();
// //     console.log(req.body.CateOffer);
// //     offerAndCouponHelpers.addOfferInCategory(req.body.category,req.body.CateOffer).then((response)=>{
// //         console.log(response);
// //     })
// // })

// // add offer in product in admin side
// router.post('/product-add-product-offer',(req,res)=>{
//   offerAndCouponHelpers.addProductOffer(req.body).then((response)=>{
//       res.json(response)
//   })
// })

// // show product offer in admin side 
// router.get('/showAllProductOffers',verifyLogin,(req,res)=>{

//   offerAndCouponHelpers.showAllProductOffers().then((allOffers)=>{
//       console.log(allOffers);
//       res.render('admin/productOffer',{admin:1,allOffers})
//   })
// })

// // add new product offer 
// router.post('/addNewProductOffer',(req,res)=>{
//   console.log(req.body);
//   offerAndCouponHelpers.addproductOffer(req.body).then((response)=>{
//       res.send(response)
//   })
// })

// // delete product offer 
// router.post('/deleteOfferProduct',(req,res)=>{
//   console.log(req.body.ProductOfferId);
//   offerAndCouponHelpers.deleteProductOffer(req.body.ProductOfferId).then((response)=>{
//       res.json(response)
//   })
// })

// // coupons
// router.get('/coupons',verifyLogin,async(req,res)=>{
//  var coupons = await offerAndCouponHelpers.exisitingCoupons()
//   res.render('admin/coupons',{admin:1,coupons})
// })

// // add new coupon
// router.post('/add-new-coupon',(req,res)=>{
//   console.log(req.body);
//   offerAndCouponHelpers.addNewCoupon(req.body).then((response)=>{
//       res.json(response)
//   }).catch((response)=>{
//       res.json(response)
//   })
// })

// // delete the Coupon
// router.post('/delete-coupon',(req,res)=>{
//   console.log(req.body);
//   offerAndCouponHelpers.deleteCoupon(req.body.couponId).then((response)=>{
//       res.json(response)
//   }).catch((response)=>{
//       res.json(response)
//   })
// })

router.get('/salesreport',async(req,res)=>{
   if(req.query.id)
   {
    let orders =await  adminHelper.getAllOrders(req.query.id)
    res.render('admin/salesreport',{admin:true,orders})
   }
   else
   {

let orders=await adminHelper.getOrderhistory()
  console.log(orders)

  res.render('admin/salesreport',{admin:true,orders})
   }
})
router.get('/coupon',async(req,res)=>{
  let couponData = await adminHelper.getCoupondata()
  console.log('client coupon data.........')
  
  let date = new Date();

  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = date.getFullYear();
  
  date =  yyyy + '-' + mm + '-' + dd;
  console.log('modified date',date)
  console.log('status',couponData[0].expiry <=date)
  for(let i = 0;i<couponData.length;i++)
  {
  if(couponData[i].expiry < date){
    couponData[i].expired=true

    
  }
}
console.log(couponData)



  res.render('admin/coupon',{admin:true,couponData})
})
router.get('/addcoupon',(req,res)=>{
  res.render('admin/addCoupon',{admin:true})

})
router.post('/addcoupon',(req,res)=>{
 
  req.body.couponCode=cc.generate();
  console.log('coupon data..........................')
  console.log(req.body)
  adminHelper.addCoupon(req.body)
  res.redirect('/admin/coupon')
})
router.get('/offer',async(req,res)=>{
  let offer = await adminHelper.getOffer()
  let date = new Date();

  let dd = String(date.getDate()).padStart(2, '0');
  let mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = date.getFullYear();
  
  date =  yyyy + '-' + mm + '-' + dd;
  console.log('modified date',date)
 
  for(let i = 0;i<offer.length;i++)
  {
  if(offer[i].expiry < date){
    offer[i].expired=true

    
  }
}
  res.render('admin/offer',{admin:true,offer})
})
router.get('/addoffer',(req,res)=>{
  res.render('admin/addoffer',{admin:true})

})
router.post('/addoffer',(req,res)=>{
 adminHelper.addOffer(req.body)
 res.render('admin/offer',{admin:true})

})
router.post('/addingProductoffer',(req,res)=>{
  console.log('offer test..................................')
  console.log(req.body.productId)
  adminDataHelper.addProductoffer(req.body.offerId,req.body.productId)
    res.redirect('/admin/admin-products')
    



})
router.post('/addingCategoryoffer',(req,res)=>{
  console.log(req.body)
  adminHelper.addCategoryoffer(req.body.offerId,req.body.productId)
  res.redirect('/admin/category')

})
router.get('/deleteOffer',(req,res)=>{
  console.log(req.query.offerId)
    adminHelper.deleteOffer(req.query.offerId)
})
router.get('/deleteProductoffer/:id',(req,res)=>{
 adminHelper.removeProductOffer(req.params.id)
 console.log('remove product id..............',req.params.id)
 res.redirect('/admin/admin-products')
})

router.get('/deletecategoryoffer/:id',(req,res)=>{
  adminHelper.removeCategoryOffer(req.params.id)
  console.log('remove product id..............',req.params.id)
  res.redirect('/admin/admin-products')
 })
 router.get('/delete-coupon',(req,res)=>{
   console.log('delete coupon id',req.query)
   adminHelper.deleteCoupon(req.query.couponId)
 })
 router.get('/most-used-payment',(req,res)=>{
   adminHelper.getTopPayment().then((response)=>{
     console.log('most used payment method')
     console.log(response)
     res.json(response)
   })
 })

 router.get('/getTopSellingCategory',(req,res)=>{
   adminHelper.getTopSellingCategory().then((response)=>{
     res.json(response)
   })
 })



module.exports = router;

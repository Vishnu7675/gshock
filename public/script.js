
function msg(bId)
{

  console.log('bcjhbjsdbcjfgggggggggggggggggggggggggggggggggggggggggggggggggggggggg')
  Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
}).then((result) => {
  if (result.isConfirmed) {
    
    $.ajax({
      url:`/admin/delete-banner?bannerId=${bId}`,
      method:'get',
      success: function(result){
          location.reload()

       
    Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
      }
    })
}

})
}

function msg1(bId)
{

  console.log('bcjhbjsdbcjfgggggggggggggggggggggggggggggggggggggggggggggggggggggggg')
  Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
}).then((result) => {
  if (result.isConfirmed) {
    
    $.ajax({
      url:`/admin/delete-product?proId=${bId}`,
      method:'get',
      success: function(result){
          location.reload()

       
    Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
      }
    })
}

})
}
function msg2(bId)
{

  console.log('bcjhbjsdbcjfgggggggggggggggggggggggggggggggggggggggggggggggggggggggg')
  Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
}).then((result) => {
  if (result.isConfirmed) {
    
    $.ajax({
      url:`/deleteAddress?addressId=${bId}`,
      method:'get',
      success: function(result){
          location.reload()

       
    Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
      }
    })
}

})
}


function msg3(bId)
{

  console.log('bcjhbjsdbcjfgggggggggggggggggggggggggggggggggggggggggggggggggggggggg')
  Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
}).then((result) => {
  if (result.isConfirmed) {
    
    $.ajax({
      url:`/admin/deleteOffer?offerId=${bId}`,
      method:'get',
      success: function(result){
          location.reload()

       
    Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
      }
    })
}

})
}
function msg5(bId)
{

  console.log('bcjhbjsdbcjfgggggggggggggggggggggggggggggggggggggggggggggggggggggggg')
  Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
}).then((result) => {
  if (result.isConfirmed) {
    
    $.ajax({
      url:`/admin/delete-coupon?couponId=${bId}`,
      method:'get',
      success: function(result){
          location.reload()

       
    Swal.fire(
        'Deleted!',
        'Your file has been deleted.',
        'success'
      )
      }
    })
}

})
}



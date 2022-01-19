require('dotenv').config();


console.log(process.env.ACCOUT_SID , process.env.ACCOUT_SID , process.env.AUTH_TOKEN)
module.exports ={
    serviceID:process.env.SERVICE_ID,
    accountSID:process.env.ACCOUT_SID,
    authToken:process.env.AUTH_TOKEN

}
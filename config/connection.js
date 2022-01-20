const mongoClient = require('mongodb').MongoClient

const state = {
    db:null
}

module.exports.connect = function(done){
    const url = "mongodb+srv://user:user123@cluster0.vlr7e.mongodb.net/test"
    const dbname='trial'

    mongoClient.connect(url,(err,data)=>{
        console.log(err)
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    })

}

module.exports.get = function(){
    return state.db
}
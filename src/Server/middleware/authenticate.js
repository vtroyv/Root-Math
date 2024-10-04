const firebaseAdmin = require('../services/firebase');

const authenticate = async (req,res,next) =>{
    try{
        const firebaseToken = req.headers.authorization?.split(" ")[1]
        let firebaseUser;
        if(firebaseToken) {
            firebaseUser = await firebaseAdmin.auth.verifyIdToken(firebaseToken);
        }

        if(!firebaseUser) {
            //Unauthroized
            return res.sendStatus(401);
        }

        const usersCollection = req.app.locals.db.collection("users")

        const user = await usersCollection.findOne({
            firebaseId: firebaseUser.user_id
        })

        if(!user) {
            //Unauthorized
            return res.sendStatus(401);
        }
        req.user = user;
        next()

    } catch(err) {
        res.sendStatus(401);
    }
}

module.exports.authenticate = authenticate;

// this workhorse function will help usvalidate the firebase tokens sent from the front end. Once validated we tack on the user document we fetched from MongoDB onto our request as req.user. 
// on the end points we use this middleware, we can always ensure that there's an authorized user by checking req.user. 


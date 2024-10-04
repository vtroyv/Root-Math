const express = require('express');
// const authenticate = require('../middleware/authenticate.js');


const router = express.Router();

// router.get("/", authenticate.authenticate, async(req,res) =>{
//     res.status(200).json(req.user)
// });


router.get('/:uid', async(req,res) =>{
    const id = req.params.uid;


   console.log(`${id} at point B on the server`)
   

    // if(!uid || !email) {
    //     return res.status(400).json({
    //         error: 'invalid request body. Must contain email and password.'
    //     })
    // }
    try{
        const usersCollection = req.app.locals.db.collection('users');

        const options = {
            projection: {_id: 0}
        }
        const user = await usersCollection.findOne({uid: id}, options);


        // console.log(user)

        

        return res.status(200).json(user)
    } catch(error){
        return res.status(500).json({error:"Server error. please try again"});

    }

});


router.post('/', async (req,res) =>{
    const {uid, email, password, examBoard, firstName, surname, year} = req.body;

    if(!email ||  !password) {
        return res.status(400).json({
            error: "Invalid request body. Must contain email, password, and name for user. "
        });
    }
    try{
        // const newFirebaseUser = await firebaseAdmin.createUser({
        //     email, 
        //     password,
        //     displayName: firstName
        // });

       
            const usersCollection = req.app.locals.db.collection('users')
            await usersCollection.insertOne({
                firstName, 
                surname, 
                email,
                year,
                examBoard,
                // firebaseId: newFirebaseUser.uid,
                uid,
                onTrial: true, //we will set this to false when the user subscribes
                isSubscribed: false

            });


        



        // await firebaseAdmin.setCustomUserClaims(newFirebaseUser.uid, {trial: true, subscribed: true});
   


        return res.status(200).json({
            uid: uid, 
            firstName: firstName,
            surname: surname, 
            email: email, 
            examBoard: examBoard, 
            year:year,
            onTrial: true, 
            isSubscribed: false

        }).send();
        
    } catch(error){
        if(error.code ==='auth/email-already-exists'){
            return res.status(400).json({error: "User account already exists at email address."})
        }
        return res.status(500).json({error:"Server error. please try again"});
    }
});

module.exports.Userrouter = router;



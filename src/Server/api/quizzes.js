const express = require('express');

const router = express.Router();

router.get('/', async(req, res) =>{

    try{
        const quizCollection = req.app.locals.db.collection('quizzes');

        const cursor = await quizCollection.find();
        const quizzes = await cursor.toArray();

        

        return res.status(200).send(quizzes)


    } catch(error){
        return res.status(500).json({error:"Server error. please try again"});

    }
  
})

module.exports.Quizzesrouter= router
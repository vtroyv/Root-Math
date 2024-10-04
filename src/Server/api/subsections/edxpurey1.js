const express = require('express');

const router = express.Router();

router.get('/:subsection' , async (req,res) =>{
    const topic = req.params.subsection;

    try{
    const subsectionCollection = req.app.locals.db.collection('edx-pure-y1-subsections');
    const options ={
        projection: {_id: 0}
    }
    const {subsections} = await subsectionCollection.findOne({name: topic}, options);
    

    return res.status(200).json(subsections)
    } catch(error) {
        return res.status(500).json({error:"Server error. please try again"});
    }
})

module.exports.subsectionRouter = router;
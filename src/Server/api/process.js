/*

The purpose of this route is to get the users uploaded image u
convert it to latex using the mathpix API and then apply some generic spell check/ error, 
it then needs to return the data to the client in a way where it can be efficiently displated within a mathfield element, 
i recomend sending it in a fashion which depects the code line by line to enable it to be correctly shown within the mathfield element. 

back on the client once the user has checked over their work once more and validated it we will send it off to the marking/feedback route which will use 
a combination of chatgpt and sympy to mark the work 
 */

const {S3Client, GetObjectCommand} = require("@aws-sdk/client-s3");
const express = require('express');
const axios = require('axios');
const {mathpixOCR} = require('./utilities/mathpixOCR');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');


//in due time create a utility file for amaozn s3 with the required methods 
//and s3 initialization all there so we dont repeat code by doing mulitple imports for the same environmental variables to do the same 
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
    credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
    },
    region: bucketRegion
})

const router = express.Router();

router.get('/:imageKey', async (req, res)=>{
    
    //this means when we send a request to the process rotue we 
    //must send the imageKey along with it
    const imageKey = req.params.imageKey; 


    //now that we've gotten the image key we need to convert it into a url before we pass it to mathpixOCR 
    const getObjectParams  = {
        Bucket: bucketName, 
        Key: imageKey
    }
    const command = new GetObjectCommand(getObjectParams);

    const imageUrl = await getSignedUrl(s3, command, {expiresIn:3600});

    console.log(imageUrl);
    //now that we've generated the image URL pass it mathpixOCR function to get the latex
    const latexResponse  = await mathpixOCR(imageUrl);
    

    res.status(200).json({message:'processed', answer:latexResponse}).send();


    //get the image from s3 
})

module.exports.processRouter = router;

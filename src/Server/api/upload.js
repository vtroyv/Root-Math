/* 
The main purpose of this route is to take the uploaded images from the user and add it to amazon s3. 

Were going to need to add some validation into it meaning that it DOESN'T UPLOAD ANY IMAGES THAT DON"T CONTAIN MATHEMATICS

were also going to need to add support for uploading/processing multiple images as exteneded questons may be longer 
*/

const express = require('express');
const multer = require('multer');
const {S3Client, PutObjectCommand} = require("@aws-sdk/client-s3");



const router = express.Router();

//multer set up 
const storage = multer.memoryStorage()
const upload  = multer({storage: storage})

//aws S3 set up
const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretKey = process.env.SECRET_ACCESS_KEY; 


const s3 = new S3Client({
    credentials:{
        accessKeyId: accessKey, 
        secretAccessKey: secretKey
    }, 
    region: bucketRegion, 

})


router.post('/', upload.single('image') ,async (req, res) => {
    console.log('req.body', req.body);
    console.log('req.file', req.file)
    const params = {
        Bucket: bucketName, 
        Key: req.body.imageKey, //were going to need to set this key to probably the users uid+name of the question so we can accurately display the correct question for the each user
        Body: req.file.buffer, 

        //its really good to specify the content type which will tell S3 what 
        //kind of image it is 
        ContentType: req.file.mimetype, 
    }

    const command = new PutObjectCommand(params)
    await s3.send(command);

    req.io.emit('imageUploaded', { imageKey: req.body.imageKey });

    res.status(200).send({ message: 'File received.', imageKey: req.body.imageKey });
})

module.exports.uploadRouter = router; 



//write the code that enables a user to upload a image/pdf whatever etc. 
    //remember were going to have a file upload button in the frontend, then change it to a qr code generator that generates a qr code that enables someone to take a picture of the work, scan the qr code,
    //then upload directly from their mobile phone gallary to the webapp. 


    /*
    on the front end we'll probably wish to send some of the logged in users details 
    to our express server when we upload they're hand written text, purely because we will 
    probably wish to store some of the relevant details in a ideal collection on mongo db to enable us to 
    refetch it if they decide to look at previous workings etc. 

    So our qr code generator will proabbly have to store such information, so that when they upload on mobile phone that information is stored. 
    
    */

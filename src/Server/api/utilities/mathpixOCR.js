// lets write the template code for the mathpix api here

//Our aim is to write a function that is called within the process route, the purpose of this funtion is to recieve an image 
//and return the latex representation of that image. 
const axios = require('axios');
const appId = process.env.MATHPIX_APP_ID;
const appKey = process.env.MATHPIX_API_KEY;

//Every mathpixOCR server side request should include 2 headers: 
/*
app_id to identify your application 
app_key to authorize acceess to the service



*/
const headers ={
    "app_id": appId, 
    "app_key": appKey,
    "Content-type": "application/json"
};

 async function mathpixOCR(imageUrl){
    try{
        const response = await axios.post('https://api.mathpix.com/v3/text', {
        "src": imageUrl,
        "include_line_data": true,
        "enable_spell_check": true

    }, {headers: headers})
    
    return response.data

    } catch(error){
        //if the request failed, throw the error. 
        console.log(error.message);
        
    }
    




}

module.exports.mathpixOCR = mathpixOCR
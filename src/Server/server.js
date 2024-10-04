const express = require('express');
const cors = require('cors');
const http = require('http');
const {Server} = require('socket.io');


require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });


const {db} = require('./config/db.js');
const {Userrouter} = require('./api/user.js');
const {Quizzesrouter} = require('./api/quizzes.js');
const {subsectionRouter} = require('./api/subsections/edxpurey1.js');
const {uploadRouter} = require('./api/upload.js');
const {processRouter} =require('./api/process.js')

const app = express();
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors:{
        origin: "*",
        methods: ["GET", "POST"]
    }
});
//middleware to add the socket to the request
//this means every request thats mde the socket is added to the request meaning we can access it in routes to emit messages
app.use((req,res, next)=>{
    req.io = io
    next()
});


db(process.env.MONGODB_URI, app);



app.use(cors({origin: true}));
app.use(express.json());
app.use("/api/user", Userrouter);
app.use("/api/quizzes", Quizzesrouter);
app.use("/api/subsections/edxpurey1", subsectionRouter);
app.use("/api/upload", uploadRouter); 
app.use("/api/process", processRouter);

io.on('connection', (socket) => {
    console.log('a user connected')

    //handle disconnection
    socket.on('disconnect', ()=> {
        console.log('user disconnected')
    });
    
    //handle custom events as required 

})

const port = process.env.SERVER_PORT || 4000;

httpServer.listen(port, '0.0.0.0', ()=>{
    console.log(`App is listening on PORT ${port}`);
})



//if the current middleware function does not end the request-response cycle, it must call next( ) to pass control to the next middleware funciton. Otherwise, the request will be left hanging. 

//PART 1 complete:
//so far we've created two routes in our user.js file. The first one gets a user from req.user, which we added in the authentication middleware and sends the document back
//the seocnd one is our sign up route, which creates a new user and adds them to the collection.
//we do very simple validation on the request body to make sure the fields necessary are there.
// Much more expansive calidation can be done, a good library for taht is express-validator. 
//after validating the body, we then use the firebase admin SDK to create the user. 
//This is something that can be done on the front end, but the reason we do it on the back end is the next piece, relating the firebase account to our user document in MongoDB. 
//we then return a message to the front end saying the user was created, or if there's any erros we send those instead. 


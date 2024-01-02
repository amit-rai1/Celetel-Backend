
const express = require('express');
const passport = require('passport');
const session = require('express-session');
import  bodyParser  from 'body-parser';
import cors from 'cors';



// const app = require('../app').default;

// import userRoute from './route/userRoute'
// import adminRoute from './route/adminRoute'
import { mongoconnection } from './db';
// import client from './model/client';
// import client from './route/client'
// import addData from './route/datamodel'
// import { addSenderID } from './controller/senderId';
// import permission from './route/permission'
// import addSenderID from './route/senderId'
import clientRoute from './route/clientRoute'
import socialRoute from './route/socialRoute'
import sessionMiddleware from './middleware/sessionMiddleware';
const cookieSession = require("cookie-session");
// const passportStrategy = require("./passport");
const app = express()

console.log(Date.now(),"app");

mongoconnection();

app.use(cors({origin:'http://localhost:3000',
methods:"GET,POST,PUT,DELETE",
credentials:true
}));
app.use(bodyParser.urlencoded({
    extended:true
}));
// app.use(
// 	cookieSession({
// 		name: "session",
// 		keys: ["cyberwolve"],
// 		maxAge: 24 * 60 * 60 * 100,
// 	})
// );
app.use(bodyParser.json())

// app.use("/api/client",client)
app.get("/",(req,res)=>{
    res.send("server listining on 8600")
})

// app.use(session({
// secret:"celetel97654321abd",
// resave:false,
// saveUninitialized:true
//  }));
app.use(session({
    secret: 'somethingsecretgoeshere',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
 }));

// Passport initialization and session setup
app.use(passport.initialize());
app.use(passport.session());

// Use the defined routes
app.use('/auth', socialRoute);

// app.use('/api/admin', adminRoute);
// app.use('/api/addData',addData)
// app.use('/api/',addSenderID);
// app.use('/api/userRoute', userRoute);
// app.use('/api/',permission)

app.use('/api/client', clientRoute);



export default app;
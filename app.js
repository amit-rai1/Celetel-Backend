
const express = require('express');
import  bodyParser  from 'body-parser';
import cors from 'cors';
const fs = require('fs');
const path = require('path'); 

const file = fs.readFileSync('./651599B3F851256DA2B66043D2F11BDA.txt');


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
import sessionMiddleware from './middleware/sessionMiddleware';
const app = express()

console.log(Date.now(),"app");

mongoconnection();
app.use(cors({origin:'*'}));
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json())
app.use(sessionMiddleware);

// app.use("/api/client",client)
app.get("/",(req,res)=>{
    res.send("server listining on 9800")
})

app.get('/.well-known/pki-validation/651599B3F851256DA2B66043D2F11BDA.txt', (req, res) => {
    const filePath = path.join(__dirname, '651599B3F851256DA2B66043D2F11BDA.txt');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Error sending file:', err);
            res.status(err.status).end();
        } else {
            console.log('File sent successfully');
        }
    });
});
// app.use('/api/admin', adminRoute);
// app.use('/api/addData',addData)
// app.use('/api/',addSenderID);
// app.use('/api/userRoute', userRoute);
// app.use('/api/',permission)

app.use('/api/client', clientRoute);



export default app;
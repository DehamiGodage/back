import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import productRouter from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import  orderRouter  from './routes/orderRouter.js';
import jwt from 'jsonwebtoken';

const app = express();

//middeleware
app.use(bodyParser.json());
app.use(
    (req,res,next)=>{
    const tokenString = req.header("Authorization");
    if(tokenString != null){
        const token = tokenString.replace("Bearer ",""); //Bearer and space will be removed from the token string
        //console.log(token);

        jwt.verify(token,"mi@BA56",
            (err,decoded)=>{
            if(decoded != null){
                req.user = decoded;
                next();
            }else{
                console.log(err)
                res.status(403).json({
                    message: "Invalid token"
                })
            }
}
)
    }else{
                next();
            }
    }
)


// Connect to MongoDB
mongoose.connect('mongodb://Admin:123@ac-nv8k4y8-shard-00-00.cmnmjtr.mongodb.net:27017,ac-nv8k4y8-shard-00-01.cmnmjtr.mongodb.net:27017,ac-nv8k4y8-shard-00-02.cmnmjtr.mongodb.net:27017/?ssl=true&replicaSet=atlas-zu7gfb-shard-0&authSource=admin&appName=Cluster0')
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err) => {       //catch()=>{console.log('error')}
    console.error(err);
    console.error(err.message);
});


//to connect to the student router
//app.use("/students",studentRouter);
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);




//to start app
app.listen(3000,
    ()=>{
        console.log("server is running on port 3000");
 }
);  



//mongodb+srv://Admin:123@cluster0.cmnmjtr.mongodb.net/?appName=Cluster0
//mongodb://Admin:123@ac-nv8k4y8-shard-00-00.cmnmjtr.mongodb.net:27017,ac-nv8k4y8-shard-00-01.cmnmjtr.mongodb.net:27017,ac-nv8k4y8-shard-00-02.cmnmjtr.mongodb.net:27017/?ssl=true&replicaSet=atlas-zu7gfb-shard-0&authSource=admin&appName=Cluster0
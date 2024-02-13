const express = require('express');
const userRouter = require("./routes/users/userRoutes");
const postRouter = require("./routes/posts/postRoutes");
const commentRouter = require("./routes/comments/commentRoutes");
const categoriesRouter = require('./routes/categories/categoriesRouter');
require('dotenv').config();// install dotenv, nodemon, express, mongoose, mongoex,con str
require("./config/dbConnect");
const app = express();

app.use(express.json()) // pass incoming payload

//middlewares
//routes
// -----

//users route
//POST/api/v1/users/register
//app.post();
app.use('/api/v1/users/', userRouter);
app.use('/api/v1/posts/', postRouter);
app.use('/api/v1/comments/', commentRouter);
app.use('/api/v1/categories/', categoriesRouter);



// erro handlers middleware
app.use((err, req, res, next) => {
    //status
    //message
    //stack
    const stack = err.stack;
    const message = err.message;
    const status = err.status ? err.status : 'failed';
    const statusCode = err?.statusCode ? err.statusCode : 500;
    // send response to user
    res.status(statusCode).json({
        stack,
        status,
        message,
    });
});
// Listen to server

const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`App listening on ${PORT}`))
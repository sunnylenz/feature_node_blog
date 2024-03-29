const express = require('express');
const userRouter = require("./routes/users/userRoutes");
const postRouter = require("./routes/posts/postRoutes");
const commentRouter = require("./routes/comments/commentRoutes");
const categoriesRouter = require('./routes/categories/categoriesRouter');
const globalErrorHandler = require('./middlewares/globalErrHandler');
//const isAdmin = require('./middlewares/isAdmin');
require('dotenv').config();// install dotenv, nodemon, express, mongoose, mongoex,con str
require("./config/dbConnect");
const app = express();

app.use(express.json()) // pass incoming payload

//app.use(isAdmin)

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
app.use(globalErrorHandler);

//404 Error
app.use('*', (req, res) => {
    res.status(404).json({
        message: `${req.originalUrl} Route not Found!!!`
    });
})
// Listen to server

const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`App listening on ${PORT}`))
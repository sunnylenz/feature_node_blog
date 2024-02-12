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

//POST/api/v1/users/login

//GET/api/v1/users/profile/:id

//GET/api/v1/users

//DELETE/api/v1/users/:id

//PUT/api/v1/users/:id

//.............
//posts route
//..............

//POST/api/v1/posts
//..................
//comments route
//..................


//...................
//categories route
//...................


// erro handlers middleware
// Listen to server

const PORT = process.env.PORT || 9000;
app.listen(PORT, console.log(`App listening on ${PORT}`))
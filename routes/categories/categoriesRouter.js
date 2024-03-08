const express = require('express');
const categoriesRouter = express.Router();
const { createCategoriesCtrl, categoriesCtrl, categoryCtrl, deleteCategoryCtrl, updateCategoriesCtrl } = require('../../controllers/categoriesController');
const isLoggedIn = require("../../middlewares/isLoggedIn");


//POST/api/v1/categories
categoriesRouter.post('/', isLoggedIn, createCategoriesCtrl);

//GET/api/v1/categories
categoriesRouter.get('/', categoriesCtrl)

//GET/api/v1/categories/:id
categoriesRouter.get('/:id', categoryCtrl);


//DELETE/api/v1/categoriess/:id
categoriesRouter.delete('/:id', deleteCategoryCtrl);

//PUT/api/v1/categories/:id
categoriesRouter.put('/:id', updateCategoriesCtrl);

module.exports = categoriesRouter;
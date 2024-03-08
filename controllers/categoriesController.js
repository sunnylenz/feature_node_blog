const Category = require("../models/Category/Category");
const { AppErr } = require("../utils/appErr");
const createCategoriesCtrl = async (req, res, next) => {
    const { title } = req.body;
    try {
        const titleFound = await Category.findOne({ title });
        if (titleFound) {
            return next(new AppErr("Category aready exist"));
        }
        const category = await Category.create({ title, user: req.userAuth })
        res.json({
            status: 'success',
            data: category,
        })
    } catch (error) {
        next(new AppErr(error.message));
    }
}

const categoriesCtrl = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.json({
            status: 'success',
            results: categories.length,
            data: categories,
        });
    } catch (error) {
        next(new AppErr(error.message));
    }
}

const categoryCtrl = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        res.json({
            status: 'success',
            data: category,
        })
    } catch (error) {
        next(new AppErr(error.message));
    }
}

const deleteCategoryCtrl = async (req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({
            status: 'success',
            data: 'Deleted successfully'
        });
    } catch (error) {
        next(new AppErr(error.message));
    }
}

const updateCategoriesCtrl = async (req, res, next) => {
    const { title } = req.body;
    try {
        const titleFound = await Category.findOne({ title });
        if (titleFound) {
            return next(new AppErr("Category Already Exists"));
        }
        const category = await Category.findByIdAndUpdate(req.params.id, { title }, { new: true, runValidators: true });
        res.json({
            status: 'success',
            data: category,
        });
    } catch (error) {
        next(new AppErr(error.message));
    }
}

module.exports = {
    createCategoriesCtrl,
    categoriesCtrl,
    categoryCtrl,
    deleteCategoryCtrl,
    updateCategoriesCtrl
}
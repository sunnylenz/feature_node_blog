const createCategoriesCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'categories created'
        })
    } catch (error) {
        res.json(error.message);
    }
}

const categoriesCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'Categories Route'
        })
    } catch (error) {
        res.json(
            error.message
        )
    }
}

const categoryCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'category route'
        })
    } catch (error) {
        res.json(error.message);
    }
}

const deleteCategoryCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'delete categories route'
        });
    } catch (error) {
        res.json(error.message);
    }
}

const updateCategoriesCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'categories update'
        })
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = {
    createCategoriesCtrl,
    categoriesCtrl,
    categoryCtrl,
    deleteCategoryCtrl,
    updateCategoriesCtrl
}
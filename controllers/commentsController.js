const createCommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'comment created'
        })
    } catch (error) {
        res.json(error.message);
    }
}

const commentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'comment route'
        })
    } catch (error) {
        res.json(error.message);
    }
}
const deleteCommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'delete comment route'
        });
    } catch (error) {
        res.json(error.message);
    }
}

const updateCommentCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'comment update'
        });
    } catch (error) {
        res.json(error.message);
    }
}

module.exports = {
    createCommentCtrl,
    commentCtrl,
    deleteCommentCtrl,
    updateCommentCtrl
}
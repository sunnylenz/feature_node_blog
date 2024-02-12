
// creates a post
const createPostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'post created'
        })
    } catch (error) {
        res.json(error.message);
    }
}

// gets a single post
const getPostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'post route'
        })
    } catch (error) {
        res.json(error.message);
    }
}

// returns an array of all posts
const postsCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'posts route'
        })
    } catch (error) {
        res.json(error.message);
    }
}


// deetes the given post
const deletePostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'delete post route'
        });
    } catch (error) {
        res.json(error.message);
    }
}


// updates the given post
const updatePostCtrl = async (req, res) => {
    try {
        res.json({
            status: 'success',
            data: 'post update'
        })
    } catch (error) {
        res.json(error.message);
    }
}


module.exports = {
    createPostCtrl,
    getPostCtrl,
    postsCtrl,
    deletePostCtrl,
    updatePostCtrl,
}
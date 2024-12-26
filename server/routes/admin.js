const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const adminLayout = '../views/layouts/admin';
const jwtSecret = process.env.JWT_SECRET;

/**
 * 
 * Check Login
 */
const authMiddleware = (req, res, next) => {
const token = req.cookies.token;

if(!token) {
    return res.status(401).json({ message: 'Unauthorized' });
}

try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
} catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
}

}


/**
 * GET /
 * Admin - Login Page
 */
router.get('/admin', async (req, res) => {    

    try {
        const locals = {
            title: "Admin Page",
            description: "This is the Admin Page",
    }

    res.render('admin/index', {
        locals,
        layout: adminLayout,
    })
    } catch (error) {
        
    }    
    
});

/**
 * POST /
 * Admin - check Login
 */
router.post('/admin', async (req, res) => {
    try {

        const { username, password } = req.body;

        const user = await User.findOne({ username });

        if(!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id}, jwtSecret );
        res.cookie('token', token, { httpOnly: true });

        res.redirect('/dashboard');

        res.redirect('/admin');
    } catch (error) {
        console.log(error); 
    }
});

/**
 * GET /
 * Admin Dashboard
 */
router.get('/dashboard', authMiddleware, async (req, res) => {

    try {
         const locals  = {
            title: "Admin Dashboard",
            description: "Admin Dashboard Page"
        }

        const data = await Post.find();
        res.render('admin/dashboard', {
            locals,
            layout: adminLayout,
            data
        });
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - Create New Post
*/

router.get('/add-post', authMiddleware, async (req, res) => {

    try {
         const locals  = {
            title: "Add Post",
            description: "Add Post Page"
        }

        const data = await Post.find();
        res.render('admin/add-post', {
            locals,
            layout: adminLayout,
        });
    } catch (error) {
        console.log(error);
    }
});

// router.post('/admin', async (req, res) => {
//     try {

//         const locals = {
//             title: "Admin Panel",
//             description: "Admin Login Page"
//         };

//         const { username, password } = req.body;

//         console.log(req.body);

//         res.redirect('/admin');
//     } catch (error) {
//         console.log(error); 
//     }
// });

/**
 * POST /
 * Admin - Register
 */
router.post('/register', async (req, res) => {
    try {

        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await User.create({ username, password: hashedPassword });
            res.status(201).json({ message: 'User created', user });
        } catch (error) {
            if(error.code === 11000) {
                res.status(409).json({ message: 'Username already exists' });
            }
            res.status(500).json({ message: 'Internal Server Error '})
        }

    } catch (error) {
        console.log(error); 
    }
});

module.exports = router;
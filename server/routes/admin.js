const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const Post = require('../models/Post');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const path = require('path');
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

                let perPage = 9;
                let page = req.query.page || 1;
                
                const data = await Post.find().sort({ createdAt: -1 }).lean() // Ordenar por fecha de creación en orden ascendente
                .skip(perPage * page - perPage)
                .limit(perPage)
                .exec();
        
                const count = await Post.countDocuments();
                const nextPage = parseInt(page) + 1;
                const hasNextPage = nextPage <= Math.ceil(count /perPage);

        res.render('admin/dashboard', {
            locals,
            data,
            current: page,
            layout: adminLayout,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/dashboard/',
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
            description: "Add Post Page",
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

/**
 * POST /
 * Admin - Create New Post
*/
router.post('/add-post', authMiddleware, async (req, res) => {

    try {

        try {
            const newPost = new Post ({
                title: req.body.title,
                body: req.body.body,
                resolved: req.body.resolved ? true : false,
                driveLink: req.body.driveLink || null // Manejar el valor del enlace de Google Drive
            });

            console.log('Google Drive Link:', req.body.driveLink); // Log del enlace de Google Drive

            await newPost.save();

            res.redirect('/dashboard');

        } catch (error) {
            console.log(error);
        }

    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - Create New Post
*/

router.get('/edit-post/:id', authMiddleware, async (req, res) => {

    try {

        const locals  = {
            title: "Edit Post",
            description: "Edit Page"
        }

        const data = await Post.findOne({ _id: req.params.id });

        res.render('admin/edit-post', {
            locals,
            data,
            layout: adminLayout,
        });
        
    } catch (error) {
        console.log(error);
    }
});

/**
 * PUT /
 * Admin - Create New Post
*/

router.put('/edit-post/:id', authMiddleware, async (req, res) => {

    try {
        await Post.findByIdAndUpdate(req.params.id, {
            title: req.body.title,
            body: req.body.body,
            updatedAt: Date.now()
        });

        res.redirect(`/edit-post/${req.params.id}`);
        
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

/**
 * DELETE /
 * Admin - Delete Post
 */
router.delete('/delete-post/:id', authMiddleware, async (req, res) => {

    try {
        await Post.deleteOne({ _id: req.params.id });
        res.redirect('/dashboard');
    } catch (error) {
        console.log(error);
    }
});

/**
 * GET /
 * Admin - Logout
 */

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/');
});

module.exports = router;
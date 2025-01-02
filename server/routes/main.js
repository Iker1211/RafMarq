const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Función para truncar texto
const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

//Routes

/**
 * GET /
 * Home Page
 */
router.get('', async (req, res) => { 
 
    try {
        const locals = {
            title: "Bienvenido a RafMarq",
            description: "This is the RafMarq Landing Page",
        } 

        let perPage = 3;
        let page = req.query.page || 1;

        const data = await Post.find().sort({ createdAt: -1 }).lean() // Ordenar por fecha de creación en orden ascendente
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();

        const count = await Post.countDocuments();
        const nextPage = parseInt(page) + 1;
        const hasNextPage = nextPage <= Math.ceil(count /perPage);

        res.render('index', {
            locals,
            data,
            current: page,
            nextPage: hasNextPage ? nextPage : null,
            currentRoute: '/'
        });
    } catch (error) {
        console.log(error);
    }

});


/**
 * GET /
 * Post: id
 */
router.get('/post/:id', async (req, res) => {
    try {

        let slug = req.params.id;

        const data = await Post.findById({ _id: slug}).lean();

        const locals = {
            title: data.title,
            description: "This is the Post Page",
        }

        res.render('post', {
            locals,
            data,
            currentRoute: `/post/${slug}`
        });
    } catch (error) {
        console.log(error);
    }
});


router.get('/contacto', (req, res) => {    
    res.render('contacto', {
        currentRoute: '/contacto'
    });
});

/* res.render('blog', {
    currentRoute: '/blog'
}); */

router.get('/blog', async (req, res) => {   
        try {

             const locals  = {
                title: "Blog",
                description: "This is the Blog Page"
            }

            let perPage = 6;
            let page = req.query.page || 1;
    
            const data = await Post.find().sort({ createdAt: 1 }).lean() // Ordenar por fecha de creación en orden descendente
            .skip(perPage * page - perPage)
            .limit(perPage)
            .exec();
    
            const count = await Post.countDocuments();
            const nextPage = parseInt(page) + 1;
            const hasNextPage = nextPage <= Math.ceil(count /perPage);
            
            res.render('blog', {
                locals,
                data,
                current: page,
                nextPage: hasNextPage ? nextPage : null,
                currentRoute: '/blog/'
            });
        } catch (error) {
            console.log(error);
        }

});

module.exports = router;
const express = require('express');
const router = express.Router();

//Routes

router.get('', (req, res) => { 
    const locals = {
        title: "Bienvenido a RafMarq",
        description: "This is the RafMarq Landing Page",
    }  

    res.render('index', {
        locals,
        
    });
});

router.get('/contacto', (req, res) => {    
    res.render('contacto');
});

router.get('/blog', (req, res) => {    
    res.render('blog');
});

module.exports = router;
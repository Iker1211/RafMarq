require('dotenv').config();

const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const connectDB = require('./server/config/db');
require('dotenv').config();
const { isActiveRoute } = require('./server/helpers/routeHelpers');


const app = express();
const PORT = process.env.PORT || 5000 
 
//Database Connection
connectDB();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // Para manejar datos de formularios
app.use(express.json()); // Para manejar datos JSON
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI
    }),
    // cookie: { maxAge: newDate ( Date.now() + (3600000) ) }
}));

app.use(express.static('public'));

//Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/', require('./server/routes/main'));
app.use('/', require('./server/routes/admin'));

app.listen(PORT, () => {    
    console.log(`Server is running on port ${PORT}`);
});


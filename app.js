require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const CLIENT_ID = '862227601875-vu1fhma739vtsmmn9qrmttgtpap9nio4.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground/'

const REFRESH_TOKEN = '1//04YuhKtlzLVLyCgYIARAAGAQSNwF-L9IrWRvq8oPdobbWAG2TGJ-UAoadjX0ZJvNm1jNNS6Wk6-w-9KBPy73d1CnJFwkOzPCdMwc'

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
});

async function uploadFile(filePath, fileName, mimeType) {
    
    try {

        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: mimeType
            },
            media: {
                mimeType: mimeType,
                body: fs.createReadStream(filePath)
            }
        })

        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error.message);
    }
}

 // uploadFile();

async function deleteFile() {
    try {
        const response = await drive.files.delete({
            fileId: '1tX5QVW8Zat7FwXB5iav3Fsowh9aRW_pk'
        });

        console.log(response.data, response.status);

    } catch (error) {
        console.log(error.message);
    }
}

// deleteFile();

async function generatePublicUrl() {
    try {
        const fileId = '1QrsR4t5PvoUCjaRAjrmTrhY3B-oagc-I';
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })

        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        });
        console.log(result.data);
    } catch (error) {
        console.log(error.message);
    }
}

// generatePublicUrl();

const connectDB = require('./server/config/db');
const { isActiveRoute } = require('./server/helpers/routeHelpers');

const app = express();
const PORT = 5000 || process.env.PORT;
 
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

module.exports = { uploadFile };
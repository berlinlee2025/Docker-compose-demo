const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./util/database');

const rootDir = require('./util/path');
require('dotenv').config({ path: `${rootDir}/.env`});

const { printDateTime } = require('./util/printDateTime');

// 2. Test PostgreSQL connection
const { testDbConnection } = require('./util/testDbConnection');
testDbConnection(db);

const app = express(); 

// Middleware 
// 1. Requests Logging
const logger = require('./middleware/requestLogger');

console.log(`\n\nprocess.env.POSTGRES_HOST:\n${process.env.POSTGRES_HOST}\n\nprocess.env.POSTGRES_USER:\n${process.env.POSTGRES_USERNAME}\n\nprocess.env.POSTGRES_PASSWORD:\n${process.env.POSTGRES_PASSWORD}\n\n\nprocess.env.POSTGRES_DB:\n${process.env.POSTGRES_DB}\n\n\nprocess.env.POSTGRES_PORT:\n${process.env.POSTGRES_PORT}\n\nprocess.env.NODE_ENV:\n${process.env.NODE_ENV}\n`);

// Express middleware
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3020', 
            'http://localhost:3000',
            'https://www.ai-recognition-frontend.com',
            'http://112.118.109.225',
            'https://ai-recognition-frontend.onrender.com'
        ];

        console.log("Allowed Origins:", allowedOrigins); // Debugging: Log allowed origins
        console.log("Request Origin:", origin); // Debugging: Log the origin attempting access

        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.error(`Blocked by CORS for origin: `, origin);
            callback(new Error(`Not allowed by CORS`));
        }
    },
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204,
    credentials: true, // to support session cookies
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// app.options('*', cors(corsOptions)); // Enable preflight across the board

app.use(bodyParser.json({ limit: '100mb' }));

app.use(express.json()); 

// ** Express Middleware for Logging HTTP Requests **
app.use(logger);


/* importing Express routers */
const authRoutes = require('./routes/authRoutes');
const recordsRoutes = require('./routes/records');
const imageRoutes = require('./routes/images');
const webScrapRoutes = require('./routes/webScrapRoute');

/* User's auth routes for rootDir/controllers/authen */
app.use('/api/user', authRoutes);

/* User's records routes for rootDir/controllers/records */
app.use('/records', recordsRoutes);

/* Image routes for rootDir/controllers/image */
app.use(imageRoutes);

/* Web Scraper routes for rootDir/controllers/webScrap */
app.use(webScrapRoutes);

// app.listen(port, fn)
// fn will run right after listening to a port
const port = process.env.PORT || 3001;

// const DATABASE_URL = process.env.DATABASE_URL
app.listen(port, () => {
    printDateTime();
    console.log(`\nNode app is up & running on port: ${port}\n`);
})

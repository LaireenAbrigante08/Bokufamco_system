const session = require('express-session');

app.use(session({
    secret: 'Laireen', // Change this to a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

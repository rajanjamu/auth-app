const express               = require('express'),
      app                   = express(),
      mongoose              = require('mongoose'),
      bodyParser            = require('body-parser'),
      passport              = require('passport'),
      LocalStrategy         = require('passport-local'),
      passportLocalMongoose = require('passport-local-mongoose'),
      User                  = require('./models/user');

// Connect to DB
mongoose.connect('mongodb://localhost/auth_app', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Config app
app.use(express.static('public'));
app.use(require('express-session')({
    secret: 'Rusty is the best and cutest dog in the world',
    resave: false,
    saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.get('/', (req, res) => {
    res.render('home', {
        user: req.user, isLoggedIn: req.isAuthenticated()
   });
});

app.get('/secret', isLoggedIn, (req, res) => {
    res.render('secret', {
        user: req.user, isLoggedIn: req.isAuthenticated()
   });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            return res.render('register');
        }
        passport.authenticate("local")(req, res, () => {
            res.redirect('secret');
        });
    });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), (req, res) => {
    passport.authenticate("local")(req, res, () => {
        res.redirect('secret');
    });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
}

// Start server
app.listen(3000, () => console.log('Auth App running at port 3000!'));
      
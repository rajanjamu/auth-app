const bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      express = require('express'),
      app = express();

// Connect to DB
mongoose.connect('mongodb://localhost/auth_app', {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

// Config app
app.set('view engine', 'ejs');
app.set(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/secret', (req, res) => {
    res.render('secret');
});

// Start server
app.listen(3000, () => console.log('Auth App running at port 3000!'));
      
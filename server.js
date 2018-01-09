const express = require('express');
// to create templates (about.hbs)
const hbs = require('hbs');
// to print a message to a file
const fs = require('fs');
// add port to run with heroku
const port = process.env.PORT || 3000;
// to create an app call the function!
const app = express();

hbs.registerPartials(__dirname + '/views/partials');
// hbs -> handlebars is a template engine - /views -> default folder for templates
app.set('view engine', hbs);

// create your express middleware -> .use() registers your middleware
app.use((req, res, next) => {
  // log all requests
  const now = new Date().toString();
  const log = `${now}: ${req.method} ${req.url}`;

  fs.appendFile('server.log', log + '\n', (err) => {
    if(err) {
      console.log('Unable to append to server.log');
    }
  });
  console.log(log);
  next(); // it is called to say when your middleware is up
});

// app.use((req, res, next) => {
//   // the site is in maintenance mode -> do not call next() so that the handlers won't be executed
//   res.render('maintenance.hbs');
// });

// Bind application-level middleware to an instance of the app object by using the app.use()
// express.static(root) is a built-in middleware function. The root argument specifies the root directory from which to serve static assets
app.use(express.static(__dirname + '/public'));
// __dirname stores the path of your directory

hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

// handlebars helpers
hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

// the app responds for requests to the root URL (/) or route
// .get() sets up a handler -> runs after next()
app.get('/', (req, res) => {
  // home.hbs -> is the template file to render
  res.render('home.hbs', {
    pageTitle: 'Home page',
    welcomeMessage: 'Welcome to my website'
  });
});

// define another route (apart from the root route)
app.get('/about', (req, res) => {
  // .render() lets you load your templates
  res.render('about.hbs', {
    pageTitle: 'About Page'
  });
  // res.send('<h1>About page</h1>');
});

app.get('/projects', (req, res) => {
  res.render('projects.hbs', {
    pageTitle: 'Portfolio'
  });
});

// registers another handler for that http request
app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to fulfill this request'
  });
});

// The app starts up a server that listens on port 3000 for connections
app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
// https://serene-harbor-22637.herokuapp.com/

const express = require('express');
const path = require('path');
const { getActivities } = require('./fake-db'); 

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- UPDATED ROUTES WITH PAGETITLE ---

app.get('/', (req, res) => {
    res.render('index', { pageTitle: 'Home' });
});

app.get('/destinations', (req, res) => {
    res.render('destinations', { pageTitle: 'Destinations' });
});

app.get('/food', (req, res) => {
    res.render('food', { pageTitle: 'Food & Restaurants' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { pageTitle: 'Contact Us' });
});

app.get('/activities', (req, res) => {
    const allActivities = getActivities();
    res.render('activities', { activities: allActivities });
});

app.listen(PORT, () =>
  console.log(`✅ ExploreBC running — http://localhost:${PORT}`)
);
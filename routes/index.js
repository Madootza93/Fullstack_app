var express = require('express');
var router = express.Router();
var schemas = require('../models/schemas.js');

/* GET home page. */
router.get('/', async(req, res) => {
  let place = schemas.place;
  let sesh = req.session;

  let placeResult = await place.find({}).then( (placeData) => {
    res.render('index', {title:'Places to Visit', data:placeData, search:'', loggedIn:sesh.loggedIn});
  });
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/q', async(req, res) => {
  let place = schemas.place;
  let q = req.body.searchInput;
  let placeData = null;
  let sesh = req.session;
  let qry = {name:{$regex:'^' + q, $options:'i'}};

  if (q != null) {
    let placeResult = await place.find(qry).then( (data) => {
      placeData = data;
    });
  } else {
    q = 'Search';
    let placeResult = await place.find({}).then( (data) => {
      placeData = data;
    });
  }

  res.render('index', {title:'Places to Visit', data:placeData, search:q, loggedIn:sesh.loggedIn});
});

module.exports = router;

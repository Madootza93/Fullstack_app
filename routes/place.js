var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var schemas = require('../models/schemas.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/:id', async(req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.render('place', {title:'Edit', loggedIn:false, error:'Invalid Request'});
    } else {
        let id = req.params.id;
        let err = '';

        let place = schemas.place;
        let qry = {_id:id};

        let itemResult = await place.find(qry).then( (itemData) => {
            if (itemData == null) {
                err = 'Invalid ID';
            }

            res.render('place', {title:'Edit Place', item:itemData, loggedIn:sesh.loggedIn, error:err});
        });
    }
});

router.get('/delete/:id', async(req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.redirect('/login');
    } else {
        let place = schemas.place;
        let placeId = req.params.id;
        let qry = {_id:placeId};
        let deleteResult = await place.deleteOne(qry);
        res.redirect('/');
    }
});

router.post('/save', async(req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.redirect('/login');
    } else {
        let placeId = req.body.placeId;
        let placeName = req.body.placeName;
        let placeIcon = req.body.placeIcon;
        let placeUrl = req.body.placeUrl;
        let place = schemas.place;

        let qry = {_id:placeId};

        let saveData = {
            $set: {
                name: placeName,
                icon: placeIcon,
                menuUrl: placeUrl
            }
        }

        let updateResult = await place.updateOne(qry, saveData);

        res.redirect('/');
    }
});

router.post('/new', async(req, res) => {
    let sesh = req.session;

    if (!sesh.loggedIn) {
        res.redirect('/login');
    } else {
        let placeName = req.body.placeName;
        let placeIcon = req.body.placeIcon;
        let placeUrl = req.body.placeUrl;
        let place = schemas.place;

        let qry = {name:placeName};

        let searchResults = await place.findOne(qry).then( async(userData) => {
            if (!userData) {
                // ok to add place
                let newPlace = new schemas.place({
                    name: placeName,
                    icon: placeIcon,
                    placeUrl: placeUrl
                });

                let savePlace = await newPlace.save();
            }
        });

        res.redirect('/');
    }
});

module.exports = router;
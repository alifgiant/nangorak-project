// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from "firebase-functions";

// The Firebase Admin SDK to access the storage, session, etc. 
import * as firebaseAdmin from "firebase-admin";
const firebaseApp = firebaseAdmin.initializeApp(functions.config().firebase);

// Flamelink sdk to wrap firebase api call
import * as flamelink from "flamelink";
const app = flamelink({ firebaseApp, isAdminApp: true });

import * as express from "express";
const router = express.Router();

/*
 * req.params.id -> route param, /path/:version
 * req.query.id -> query string, /path?id=0
 * req.body.id -> post bosy, { "id" : 0}
 */

/* GET /images. */
router.get("/images", (request, response, next) => {
    const fileName = request.body.fileName;
    console.log(fileName);
    if (fileName == "alif.png") {
        response.send("images found");
    } else {
        response.status(404);
        response.send("images not found");
    }
});

/* GET /attractions */
router.get("/attractions", (request, response, next) => {
    response.send("attractions");
});

/* GET /facilities */
router.get("/facilities", (request, response, next) => {
    response.send("facilities");
});

/* GET /venues */
router.get("/venues", (request, response, next) => {
    const venueId = request.query.venueId;
    if (venueId) {
        // single venue
        app.content.get('venue', venueId)
            .then(venue => {
                var venueData = venue;
                venueData.venueId = venueData.id;
                delete venueData.__meta__;
                delete venueData.id;
                response.send(venueData);
            })
            .catch(error => {               
                console.error('Something went wrong while retrieving the venue. Details:', error);
                response.status(404);
                response.send('venue with that id not found');
            });
    } else {
        // all venue
        app.content.get('venue')
            .then(venues => { 
                var processedVenues = [];
                for (var id in venues) {
                    var venueData = venues[id];
                    venueData.venueId = venueData.id;
                    delete venueData.__meta__;
                    delete venueData.id;
                    processedVenues.push(venueData);
                }
                response.send(processedVenues);
            })
            .catch(error => {               
                console.error('Something went wrong while retrieving all the venue. Details:', error);
                response.status(400);
                response.send('Something went wrong while retrieving all the venue.');
            });
    }
});

/* GET /feedbacks */
router.get("/feedbacks", (request, response, next) => {
    response.send("feedbacks");
});

export = router;
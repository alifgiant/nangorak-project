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
    if (fileName === "alif.png") {
        response.send("images found");
    } else {
        response.status(404);
        response.send("images not found");
    }
});

/* GET /attractions */
router.get("/attractions", (request, response, next) => {
    function setupData(attraction) {
        delete attraction.__meta__;
        return attraction;
    }
    const venueId = request.query.venueId;    
    if (venueId) {
        // single venue attractions
        app.content
            .get('attraction')
            .then(attractions => { 
                let processedAttractions;
                for (const id in attractions) {
                    if (attractions[id].venueId === venueId) {
                        processedAttractions = setupData(attractions[id]);
                        break;
                    }
                }
                if (!processedAttractions) response.status(204);
                response.send(processedAttractions);
            })
            .catch(error => {               
                console.error('Something went wrong while retrieving the attraction. Details:', error);
                response.status(404);
                response.send('venue attraction with that id not found');
            });
    } else {
        // all attractions
        app.content.get('attraction')
            .then(attractions => { 
                let processedAttractions = [];
                for (const id in attractions) {
                    const attractionData = setupData(attractions[id]);
                    processedAttractions.push(attractionData);
                }
                response.send(processedAttractions);
            })
            .catch(error => {               
                console.error('Something went wrong while retrieving all the attractions. Details:', error);
                response.status(400);
                response.send('Something went wrong while retrieving all the attractions.');
            });
    }
});

/* GET /facilities */
router.get("/facilities", (request, response, next) => {
    function setupData(facility) {
        delete facility.__meta__;
        return facility;
    }
    const venueId = request.query.venueId;    
    if (venueId) {
        // single venue facilities
        app.content
            .get('facilities')
            .then(facilities => { 
                let processedFacilities;
                for (const id in facilities) {
                    if (facilities[id].venueId === venueId) {
                        processedFacilities = setupData(facilities[id]);
                        break;
                    }
                }
                if (!processedFacilities) response.status(204);
                response.send(processedFacilities);
            })
            .catch(error => {               
                console.error('Something went wrong while retrieving the facility. Details:', error);
                response.status(404);
                response.send('venue facility with that id not found');
            });
    } else {
        // all facilities
        app.content.get('facilities')
            .then(facilities => { 
                let processedFacilities = [];
                for (const id in facilities) {
                    const facilityData = setupData(facilities[id]);
                    processedFacilities.push(facilityData);
                }
                response.send(processedFacilities);
            })
            .catch(error => {               
                console.error('Something went wrong while retrieving all the facilities. Details:', error);
                response.status(400);
                response.send('Something went wrong while retrieving all the facilities.');
            });
    }
});

/* GET /venues */
router.get("/venues", (request, response, next) => {
    function setupData(venue) {
        venue.venueId = venue.id;
        delete venue.__meta__;
        delete venue.id;
        return venue;
    }
    const venueId = request.query.venueId;
    if (venueId) {
        // single venue
        app.content.get('venue', venueId)
            .then(venue => response.send(setupData(venue)))
            .catch(error => {               
                console.error('Something went wrong while retrieving the venue. Details:', error);
                response.status(404);
                response.send('venue with that id not found');
            });
    } else {
        // all venue
        app.content.get('venue')
            .then(venues => { 
                let processedVenues = [];
                for (const id in venues) {                
                    const venueData = setupData(venues[id]);
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
    function setupData(feedback) {
        delete feedback.__meta__;
        return feedback;
    }
    const venueId = request.query.venueId;
    const feedbackId = request.query.id;
    if (feedbackId) {
        // single feedbacks
        app.content.get('feedback', feedbackId)
            .then(feedback => response.send(setupData(feedback)))
            .catch(error => {               
                console.error('Something went wrong while retrieving the feedback. Details:', error);
                response.status(404);
                response.send('venue with that id not found');
            });
    } else if (venueId) {
        // single venue feedbacks
        app.content
            .get('feedback')
            .then(feedbacks => { 
                let processedFeedbacks;
                for (const id in feedbacks) {
                    if (feedbacks[id].venueId === venueId) {
                        processedFeedbacks = setupData(feedbacks[id]);
                        break;
                    }
                }
                if (!processedFeedbacks) response.status(204);
                response.send(processedFeedbacks);
            })
            .catch(error => {               
                console.error('Something went wrong while retrieving the facility. Details:', error);
                response.status(404);
                response.send('venue facility with that id not found');
            });
    } else {
        // all feedbacks
        app.content.get('feedback')
            .then(feedbacks => { 
                let processedFeedbacks = [];
                for (const id in feedbacks) {
                    const feedbackData = setupData(feedbacks[id]);
                    processedFeedbacks.push(feedbackData);
                }
                response.send(processedFeedbacks);
            })
            .catch(error => {               
                console.error('Something went wrong while retrieving all the facilities. Details:', error);
                response.status(400);
                response.send('Something went wrong while retrieving all the facilities.');
            });
    }
});

export = router;
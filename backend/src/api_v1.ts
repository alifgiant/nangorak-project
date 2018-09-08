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

/* GET /images. */
router.get("/images", (request, response, next) => {
    response.send("images");
});

/* GET /attractions */
router.get("/attractions", (request, response, next) => {
    response.send("attractions");
});

/* GET /facilities */
router.get("/facilities", (request, response, next) => {
    response.send("facilities");
});

/* GET /locations */
router.get("/locations", (request, response, next) => {
    response.send("locations");
});

/* GET /feedbacks */
router.get("/feedbacks", (request, response, next) => {
    response.send("feedbacks");
});

export = router;
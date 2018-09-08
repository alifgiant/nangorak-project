// Express.JS as framework
import * as express from "express";
const app = express();

// cors
import * as cors from "cors";
app.use(cors({ origin: true }));

// cookie parser
import * as cookieParser from "cookie-parser";
app.use(cookieParser());

// body message parse
import * as bodyParser from "body-parser";
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// routing middleware
import * as apis from "./api_v1";
app.use('/v1', apis);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page 
    res.status(err.status || 500);
    res.send("Error Not Found");
});

// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
import * as functions from "firebase-functions";
exports.api = functions.https.onRequest(app);
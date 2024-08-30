const express = require("express");
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const hpp = require("hpp");
const helmet = require("helmet");
const multerErrorHandler = require("./src/middlewares/multerError");
const { errorHandler } = require("./src/middlewares/errorHandler");
const routes = require("./src/routes");

const app = express();

app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.use(express.json());

app.use(cors());   // CORS is a security feature implemented by browsers to prevent web pages from making requests to a domain different from the one that served the web page
app.use(hpp());    // HPP is a middleware that helps prevent HTTP Parameter Pollution attacks.
app.use(helmet()); // Helmet helps secure your Express app by setting various HTTP headers

app.use("/", routes);

app.use(multerErrorHandler);
app.use(errorHandler);

module.exports = app;

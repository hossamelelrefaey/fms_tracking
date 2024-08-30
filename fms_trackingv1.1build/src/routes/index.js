const router = require("express").Router();

const vehicle = require("./vehicleRoutes");
const driver = require("./driverRoutes");

router.use("/vehicles", vehicle);
router.use("/drivers", driver);

// default route for the api
router.get("/", (req, res) => {
  res.json({
    message: "Welcome to the API",
  });
});

module.exports = router
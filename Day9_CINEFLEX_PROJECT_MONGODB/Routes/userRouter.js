const express = require('express');

const router = express.Router();

const authController = require("./../controllers/authController");
const userController = require("./../controllers/userController");

router.route("/updatePassword").patch(authController.protect, userController.updatePassword);
router.route("/updateMe").patch(authController.protect, userController.updateMe);

module.exports = router;
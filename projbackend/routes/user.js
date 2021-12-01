const express = require("express");
const router = express.Router();

const { getUserById, getUser, updateUser, userPurchaseList } = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserById);

// get the user
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

// updating the user
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

// user purchase list
router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;
var express = require('express');
var router = express.Router();
const { signout, signup, signin, isSignedIn } = require('../controllers/auth');
const { check } = require('express-validator');

router.post("/signup", [
    check('name').isLength({ min: 3 }).withMessage('must be at last 5 chars long'),
    check('email').isEmail().withMessage('email is required'),
    check('password').isLength({ min: 5 }).matches(/\d/).withMessage('must be at least 5 chars long')
    .withMessage('Password must contain a number')
], signup);

router.post("/signin", [
    check('email').isEmail().withMessage('email is required'),
    check('password').isLength({ min: 5 }).matches(/\d/).withMessage('must be at least 5 chars long')
    .withMessage('must contain a number')
], signin);

router.get("/signout", signout);

// test route to check bearer authentication
// router.get("/testroute", isSignedIn, (req, res) => {
//     res.send("a protected route");
// });

module.exports = router;
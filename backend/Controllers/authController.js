require('dotenv').config({ path: './config.env' }); // Load the environment variables from the config.env file
const User = require('./../Models/userModel'); // Ensure the path is correct
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Gmail transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

// Google Login Handler
exports.googleLogin = async (req, res, next) => {
    try {
        const { token } = req.body;

        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        // Check if the user already exists
        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                name,
                password: 'google_oauth',
                profilePicture: picture,
            });
        }

        // Generate JWT
        const jwtToken = jwt.sign({ id: user._id }, process.env.SECRET_STR, {
            expiresIn: process.env.LOGIN_EXPIRES,
        });

        res.status(200).json({
            status: 'success',
            token: jwtToken,
            user,
        });
    } catch (err) {
        res.status(401).json({
            status: 'fail',
            message: 'Google authentication failed. Please try again.',
        });
    }
};

// Email sending logic for signup
exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);

        const token = jwt.sign({ id: newUser._id }, process.env.SECRET_STR, {
            expiresIn: process.env.LOGIN_EXPIRES,
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: newUser.email,
            subject: 'Welcome to Our Hotel Management System',
            text: `Hi ${newUser.name},\n\nThank you for signing up. We are excited to have you onboard!`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email during signup:', error);
            }
        });

        res.status(201).json({
            status: 'success',
            token,
            data: { user: newUser },
        });
    } catch (err) {
        next(err);
    }
};

// Login function with email notification
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new Error('Please enter email or password to login'));
        }

        const user = await User.findOne({ email });

        if (!user || !(await user.comparePasswordInDb(password, user.password))) {
            return next(new Error('Incorrect email or password'));
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_STR, {
            expiresIn: process.env.LOGIN_EXPIRES,
        });

        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: user.email,
            subject: 'Successful Login to Our Hotel Management System',
            text: `Hi ${user.name},\n\nYou have successfully logged into our system. If this was not you, please contact support immediately.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email during login:', error);
            }
        });

        res.status(200).json({
            status: 'success',
            token,
            user,
        });
    } catch (err) {
        next(err);
    }
};

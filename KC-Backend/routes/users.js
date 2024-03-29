require('dotenv').config()

const express = require('express')
const router = express.Router()
const User = require('../models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
var passport = require('passport')

router.use(express.urlencoded({ extended: true }));
router.use(express.json());
router.use(passport.initialize())

//getting the user info
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findById({
            _id: req.user._id
        })
        res.status(200).json(user)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

//creating one
router.post('/signup', async (req, res) => {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const user = new User({
        fName: req.body.fName,
        lName: req.body.lName,
        email: req.body.email,
        password: hashedPassword,
        createDate: Date.now(),
        address: {
            streetAddress: "N/A",
            city: "N/A",
            state: "N/A",
            zipcode: "N/A",
        }
    })
    emailExist = await User.findOne({
        email: req.body.email
    })
    try {
        if (emailExist) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        else {
            const newUser = await user.save()
            res.status(201).json(newUser)
        }
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

//login
router.post('/signin', async (req, res) => {
    const user = await User.findOne({
        email: req.body.email
    })
    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            const payload = {
                _id: user._id,
                email: user.email,
                role: user.role
            };
            const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: 24 * 60 * 60, // 1 day in seconds
            })
            console.log("Bearer " + accessToken)
            res.status(200).json({
                accessToken: "Bearer " + accessToken,
                username: user.fName,
                role: user.role,
                expiresIn: 24 * 60 * 60 // 1 day in seconds
            })
        } else {
            res.send('Please sign in!')
        }
    }
    catch (err) {
        res.status(500).send({ message: err.message })
    }
})

//updating one
router.patch('/update-user', passport.authenticate('jwt', { session: false }), async (req, res) => {
    if (req.body.fName != null) {
        req.user.fName = req.body.fName
    }
    if (req.body.lName != null) {
        req.user.lName = req.body.lName
    }
    if (req.body.dob != null) {
        req.user.dob = req.body.dob
    }
    if (req.body.address.streetAddress != null) {
        req.user.address.streetAddress = req.body.address.streetAddress
    }
    if (req.body.address.city != null) {
        req.user.address.city = req.body.address.city
    }
    if (req.body.address.state != null) {
        req.user.address.state = req.body.address.state
    }
    if (req.body.address.zipcode != null) {
        req.user.address.zipcode = req.body.address.zipcode
    }
    if (req.body.phone != null) {
        req.user.phone = req.body.phone
    }
    if (req.body.email != null) {
        req.user.email = req.body.email
        emailExist = await User.findOne({
            email: req.body.email
        })
        if (emailExist) {
            res.send('Email already exist')
        }
    }
    if (req.body.password != null) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.user.password = hashedPassword
    }
    if (req.body.profileImage != null) {
        req.user.profileImage = req.body.profileImage
    }

    try {
        const updatedUser = await req.user.save()
        console.log(updatedUser)
        res.json(updatedUser)

    } catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})

module.exports = router
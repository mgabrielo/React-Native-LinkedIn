const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const crypto = require('crypto')
const nodeMailer = require('nodemailer')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000
const cors = require('cors');
const User = require('./models/user');
const Post = require('./models/post');

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

mongoose.connect('mongodb+srv://greycoinz:<password>@cluster0.brpnfs7.mongodb.net/').then(() => {
    console.log('connected to MongoDB')
}).catch((err) => {
    console.log('MongoDB Connection Error: ', err)
})

app.listen(port, () => {
    console.log('Server is Running on ' + port)
})

app.post('/register', async (req, res) => {
    try {
        console.log('enter')
        const { name, email, password, profileImage } = req.body
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email Already Registered' })
        }
        const newUser = new User({ name, email, password, profileImage })
        newUser.verificationToken = crypto.randomBytes(20).toString('hex')
        newUser.save()
        sendVerificationEmail(newUser.email, newUser.verificationToken)
        res.status(202).json({ message: 'Registration Successful', user: newUser })


    } catch (error) {
        console.log('Error in Registration', error)
        return res.status(500).json({ message: 'Registration Unsuccessful' })
    }
})

const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: '',
            pass: ''
        }
    })
    const mailOptions = {
        from: 'linkedin@gmail.com',
        to: email,
        subject: 'Email Verification',
        text: `please click the following link to verify your email: http://localhost:3000/verify/${verificationToken}`
    }
    try {
        await transporter.sendMail(mailOptions)
        console.log('Verification Email Sent')
    } catch (error) {
        console.log('error sending verifcation email')
    }
}

app.get('/verify/:token', async (req, res) => {
    try {
        const token = req.params.token

        const user = await User.findOne({ verificationToken: token })
        if (!user) {
            return res.status(404).json({ message: 'Invalid Token' })
        }

        user.verified = true
        user.verificationToken = undefined

        await user.save()
        return res.status(200).json({ message: 'Email Verification Successful' })
    } catch (error) {
        return res.status(500).json({ message: 'Email verfication unsucessful' })
    }

})
const genSecretKey = () => {
    const secretKey = crypto.randomBytes(20).toString('hex')
    return secretKey
}

const secretKey = genSecretKey()
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(401).json({ message: 'Invalid Access' })
        }
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }

        const token = jwt.sign({ userId: user._id }, secretKey)

        res.status(200).json({ token: token })
    } catch (error) {
        res.status(500).json({ message: 'login failed' })
    }
})

// user profile

app.get('/profile/:userId', async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: 'User profile Not found' })
        }
        return res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ message: 'Error getting User profile' })
    }
})

app.get('/users/:userId', async (req, res) => {
    try {
        const loggedInUserId = req.params.userId
        // fetch logged in users
        const loggedInUser = await User.findById(loggedInUserId).populate("connections", "_id")
        if (!loggedInUser) {
            return res.status(400).json({ message: 'User not Found' })
        }
        // get ids of all users
        const connectedUsersIds = loggedInUser.connections.map((connector) => connector._id)
        // find users not connected  to logged in user id
        const users = await User.find({ _id: { $ne: loggedInUserId, $nin: connectedUsersIds } })
        res.status(200).json({ users })
    } catch (error) {
        console.log('Error retrieving users')
        return res.status(500).json({ message: 'Error getting Users' })
    }
})
// Connect Request
app.post('/connection-request', async (req, res) => {
    try {
        const { currentUserId, selectedUserId } = req.body
        await User.findByIdAndUpdate(selectedUserId, {
            $push: { connectionRequests: currentUserId }
        })

        await User.findByIdAndUpdate(currentUserId, {
            $push: { sentConnectionRequests: selectedUserId }
        })

        res.status(200).json({ message: 'Connect Request Success' })
    } catch (error) {
        res.status(500).json({ message: 'Error in Connection request' })
    }
})

// endpoint showing all connections request

app.get('/connection-request/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId).populate('connectionRequests', 'name email profileImage').lean()
        const connectionRequests = user.connectionRequests
        res.status(200).json({ connectionRequests })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal server err' })
    }
})

// accept connection request

app.post('/connection-request/accept', async (req, res) => {
    try {
        const { senderId, recepientId } = req.body


        const sender = await User.findById(senderId)
        const recepient = await User.findById(recepientId)

        sender.connections.push(recepientId)
        recepient.connections.push(senderId)

        recepient.connectionRequests = recepient.connectionRequests.length > 0 && recepient.connectionRequests.filter((request) => {
            request.toString() !== senderId.toString()
        })

        sender.sentConnectionRequests = sender.sentConnectionRequests.length > 0 && sender.sentConnectionRequests.filter((request) => {
            request.toString() !== recepientId.toString()
        })

        await sender.save()
        await recepient.save()
        return res.status(200).json({ message: 'Connection Request Accepted Successfully' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'internal Server Error' })
    }
})

// fetch all connections of a user

app.get('/connections/:userId', async (req, res) => {
    try {
        const userId = req.params.userId
        const user = await User.findById(userId).populate('connections', 'name profileImage createdAt').exec()
        if (!user) {
            return res.status(400).json({ message: 'Invalid connections retrieval' })
        }
        return res.status(200).json({ connections: user.connections })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'error getting connections' })
    }
})

// create a post 
app.post('/create', async (req, res) => {
    try {
        const { description, imageUrl, userId, } = req.body
        const newPost = new Post({
            description: description,
            imageUrl: imageUrl,
            user: userId
        })
        await newPost.save()
        return res.status(201).json({ message: 'post crated successfully', post: newPost })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: 'error in post creation' })
    }
})
// fetch all post
app.get('/all', async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name profileImage')

        return res.status(200).json({ posts: posts })
    } catch (error) {
        return res.status(500).json({ message: 'error in post retrieval' })
    }
})
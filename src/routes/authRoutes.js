import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import db from '../db.js'

const router = express.Router()

//Register a new user endpoint /auth/register
router.post('/register', (req, res) => {

    console.log("hello world")
    const {firstname, lastname, email, username, password} = req.body
    
    const hashedPassword = bcrypt.hashSync(password, 8)

    console.log(hashedPassword)

    try {
        const insertUser = db.prepare(`INSERT INTO user (firstname, lastname, email, username, password)
        VALUES (?,?,?,?,?)`)
        const result = insertUser.run(firstname, lastname, email, username, hashedPassword)

        // create a token
        const token = jwt.sign({id: result.lastInsertRowid}, process.env.JWT_SECRET,
            {expiresIn: '24h'})
        
        res.json({token})
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }

    console.log(username, password)
    res.sendStatus(201)

})

router.post('/login', (req, res) => {

    const {username, password} = req.body

    try {
        const getUser = db.prepare('SELECT * FROM user WHERE username = ?')//prepare ? is the wildcard for inputs later on.
        const user = getUser.get(username)

        //If we cannot find a user associated with that username, return out
        if (!user) { return res.status(404).send({message: "User not found"})}

        const passwordIsValid = bcrypt.compareSync(password, user.password)

        //If the password does not match, return out of the function.
        if (!passwordIsValid) { return res.status(401).send({message: "Invalid password"})}


        console.log(user)
        //Successful authentication
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: '24h'})
        res.json({token})
    } catch (err) {
        console.log(err.message)
        res.sendStatus(503)
    }
    
}) 

export default router
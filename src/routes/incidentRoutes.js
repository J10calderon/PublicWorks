import express from 'express'
import db from '../db.js'

const router = express.Router()

// Get all incidents for logged-in user
router.get('/', (req, res) => {
    const getIncidents = db.prepare('SELECT * FROM incident WHERE reported_by = ?')
    const incidents = getIncidents.all(req.userId)
    res.json(incidents)
})

// Create a new incident
router.post('/', (req, res) => {
    const { country, region, city, street, latitude, longitude, date, description } = req.body
    const insertIncident = db.prepare(`INSERT INTO incident (reported_by, country, region, city,
        street, latitude, longitude, date, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    const result = insertIncident.run(req.userId, country, region, city, street, latitude, 
        longitude, date, description)

    //res.json is a response to the
    res.json(result)
})

// Update an incident
router.put('/:id', (req, res) => {
    const { completed } = req.body
    const { id } = req.params
    const { page } = req.query

    const updatedTodo = db.prepare('UPDATE todos SET completed = ? WHERE id = ?')
    updatedTodo.run(completed, id)

    res.json({ message: "Todo completed" })
})

// Delete an incident
router.delete('/:id', (req, res) => {
    const { id } = req.params
    const userId = req.userId
    const deleteTodo = db.prepare(`DELETE FROM todos WHERE id = ? AND user_id = ?`)
    deleteTodo.run(id, userId)
    
    res.send({ message: "Todo deleted" })
})

export default router
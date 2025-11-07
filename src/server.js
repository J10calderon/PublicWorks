import express from 'express'
import path,  {dirname} from 'path'
import {fileURLToPath} from 'url'
import authRoutes from './routes/authRoutes.js'
import incidentRoutes from './routes/incidentRoutes.js'
import authMiddleware from './middleware/authMiddleware.js'

const app = express()
const PORT = process.env.PORT || 5003 

//Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url)
//get the directory name from the file path
const __dirname = dirname(__filename)

//Serves the HTML file from the /public directory
//Tells express to serve all files from the public folder as static assets/files. Any request for the css files will be resolved to the public directory.
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.json())

//serving up the HTML file from the /public directory
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html')) //locate path to find the files or folders
// })

//Routes
app.use('/auth', authRoutes) //adds /auth to all routing in authRoutes
app.use('/incident', authMiddleware, incidentRoutes)

app.listen(PORT, () => {
    console.log(`Server has started on port: ${PORT}`)
})
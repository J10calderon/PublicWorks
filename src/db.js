import {DatabaseSync} from 'node:sqlite'
const db = new DatabaseSync(':memory:')

//execute sql statements from strings
db.exec(`
    CREATE TABLE user (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname TEXT,
        lastname TEXT,
        email TEXT,
        username TEXT UNIQUE,
        password TEXT
    )
`)

db.exec(`
    CREATE TABLE incident (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reported_by INTEGER,
        country TEXT,
        region TEXT,
        city TEXT,
        street TEXT,
        longitude TEXT,
        latitude TEXT,
        date DATETIME,
        description TEXT,
        FOREIGN KEY(reported_by) REFERENCES users(id)
    )
`)

db.exec(`
    CREATE TABLE civil_works (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        country TEXT,
        region TEXT,
        city TEXT,
        street TEXT,
        longitude TEXT,
        latitude TEXT
    )
`)
db.exec(`
    CREATE TABLE incident_civil_works (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        incident_id INTEGER,
        civil_works_id INTEGER,
        FOREIGN KEY(incident_id) REFERENCES incident(id),
        FOREIGN KEY(civil_works_id) REFERENCES civil_works(id)
    )
`)

export default db
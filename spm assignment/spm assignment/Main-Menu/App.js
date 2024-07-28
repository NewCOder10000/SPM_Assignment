const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const DBConfig = require('./DBConfig.js');
const user = require('./model/User.js')
const UserController = require("./Controller/UserController.js");

const app = express();
const port = process.env.PORT || 5000;

mssql.on('error', err => {
    console.log('SQL Global Error:', err);
});

(async () => {
    try {
        const pool = await mssql.connect(DBConfig);
        console.log('Connected to MSSQL database');
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
})();

app.use(bodyParser.json());
app.use(express.static('Main-Menu-Files'));

mssql.connect(DBConfig, (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        throw err;
    }
    console.log('Connected to MSSQL database');
});

app.post('/score', async (req, res) => {
    const { Username, Score } = req.body;

    console.log('Received:', req.body);

    if (!Username || !Score) {
        console.error('Validation Error: Username and Score are required');
        return res.status(400).json({ error: 'Username and Score are required' });
    }

    const sql = 'INSERT INTO GameUsers (Username, Score) VALUES (@Username, @Score)';

    try {
        const request = new mssql.Request();
        request.input('Username', mssql.NVarChar, Username);
        request.input('Score', mssql.Int, Score);

        await request.query(sql);

        console.log('Score submitted successfully');
        res.json({ message: 'Score submitted successfully' });
    } catch (err) {
        console.error('Error inserting score:', err);
        res.status(500).json({ error: 'Error inserting score' });
    }
});

app.get('/api/highscore', UserController.getHighestScore);

app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
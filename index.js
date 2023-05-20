const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//wS5GsNu1XNkJV7kk
//toy-marketplace







app.get('/', (req, res) => {
    res.send('Running the server');
})

app.listen(port, () => {
    console.log('Running from port', port);
})
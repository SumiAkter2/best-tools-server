const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ccgcw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const collection = client.db("tools-admin").collection("products");

    }

    finally {

    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Hello Best Tools co. !')
})

app.listen(port, () => {
    console.log(` Best Tools co. listening on port ${port}`)
})
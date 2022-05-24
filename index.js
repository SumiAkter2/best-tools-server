const express = require('express');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// let ObjectId = require('mongodb').ObjectID;
app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ccgcw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const collection = client.db("bestTools").collection("products");
        console.log('collected');

        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = collection.find(query);
            const services = await cursor.toArray();
            res.send(services);
            //allah
        });

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await collection.findOne(query);
            res.send(service);
        });
        //
        app.post("/product", async (req, res) => {
            const newItem = req.body;
            // const tokenInfo = req.headers.authorization;
            // console.log(tokenInfo);
            const result = await collection.insertOne(newItem);
            res.send(result);
        });

        // 
        app.put('/quantity/:id', async (req, res) => {
            const id = req.params.id;
            const query = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: query.quantity,
                },
            };
            const result = await collection.updateOne(filter, updateDoc, option);
            res.send(result);
        });

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
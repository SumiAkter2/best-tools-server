const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { get } = require('express/lib/response');

app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ccgcw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// function sendAppointmentEmail(booking) {
//     const { patient, patientName, treatment, date, slot } = booking;

//     var email = {
//         from: process.env.EMAIL_SENDER,
//         to: patient,
//         subject: `Your Appointment for ${treatment} is on ${date} at ${slot} is Confirmed`,
//         text: `Your Appointment for ${treatment} is on ${date} at ${slot} is Confirmed`,
//         html: `
//       <div>
//         <p> Hello ${patientName}, </p>
//         <h3>Your Appointment for ${treatment} is confirmed</h3>
//         <p>Looking forward to seeing you on ${date} at ${slot}.</p>

//         <h3>Our Address</h3>
//         <p>Andor Killa Bandorban</p>
//         <p>Bangladesh</p>
//         <a href="https://web.programming-hero.com/">unsubscribe</a>
//       </div>
//     `
//     };

// emailClient.sendMail(email, function (err, info) {
//     if (err) {
//         console.log(err);
//     }
//     else {
//         console.log('Message sent: ', info);
//     }
// });

// }
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'UnAuthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'Forbidden access' })
        }
        req.decoded = decoded;
        next();
    });
}
async function run() {
    try {
        await client.connect();
        const collection = client.db("bestTools").collection("products");
        const userCollection = client.db("bestTools").collection("users");
        const reviewCollection = client.db("bestTools").collection("review")
        const ordersCollection = client.db("bestTools").collection("orders");

        //orders:
        app.post("/order", async (req, res) => {
            const result = await ordersCollection.insertOne(req.body);
            res.json(result);
        });
        app.get("/order/:email", async (req, res) => {
            const user = req.params.email
            const query = { email: user }
            const result = await ordersCollection.find(query).toArray();
            res.send(result)
        });
        app.get("/orderdetails/", async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.send(result)
        });
        app.delete("/order/:id", async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query)
            res.json(result)
        });


        //delet:
        app.delete("/deleteProducts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collection.deleteOne(query);
            res.json(result);
        });
        ////reveiw:
        app.post('/review', async (req, res) => {
            const result = await reviewCollection.insertOne(req.body);
            res.json(result);
        })
        //get review
        app.get('/review', async (req, res) => {
            const result = await reviewCollection.find({}).toArray();
            res.json(result);
        })
        //////products:
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = collection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        ///hello
        //comment
        app.get("/products/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const item = await collection.findOne(query);
            res.send(item);
        });
        //update::
        app.post("/update", async (req, res) => {
            const result = await userCollection.insertOne(req.body);
            res.json(result)
        });
        app.get('/update', verifyJWT, async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
        });
        // user:

        app.get('/user', verifyJWT, async (req, res) => {
            const users = await userCollection.find().toArray();
            res.send(users);
        });
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5h' })
            res.send({ result, token });
        })
        // add product:
        app.post("/addProduct", async (req, res) => {
            const result = await collection.insertOne(req.body);
            res.send(result)
        });
        ///make admin

        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const user = await userCollection.findOne({ email: email });
            const isAdmin = user.role === 'admin';
            res.send({ admin: isAdmin })
        })

        app.put('/user/admin/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;
            const requester = req.decoded.email;
            const requesterAccount = await userCollection.findOne({ email: requester });
            if (requesterAccount.role === 'admin') {
                const filter = { email: email };
                const updateDoc = {
                    $set: { role: 'admin' },
                };
                const result = await userCollection.updateOne(filter, updateDoc);
                res.send(result);
            }
            else {
                res.status(403).send({ message: 'forbidden' });
            }

        })

        // delete   
        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collection.deleteOne(query);
            res.send(result);
        });




















































        // const verifyAdmin = async (req, res, next) => {
        //     const requester = req.decoded.email;
        //     const requesterAccount = await userCollection.findOne({ email: requester });
        //     if (requesterAccount.role === 'admin') {
        //         next();
        //     }
        //     else {
        //         res.status(403).send({ message: 'forbidden' });
        //     }

        // }



        // app.get('/admin/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const user = await userCollection.findOne({ email: email });
        //     const isAdmin = user.role === 'admin';
        //     res.send({ admin: isAdmin })
        // })
        //

        // app.put('/user/admin/:email', verifyJWT, verifyAdmin, async (req, res) => {
        //     const email = req.params.email;
        //     const filter = { email: email };
        //     const updateDoc = {
        //         $set: { role: 'admin' },
        //     };
        //     const result = await userCollection.updateOne(filter, updateDoc);
        //     res.send(result);
        // })
        // app.get('/user', async (req, res) => {
        //     const users = await collection.find().toArray();
        //     res.send(users);
        // });


        // app.put('/user/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const user = req.body;
        //     const filter = { email: email };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: user,
        //     };
        //     const result = await userCollection.updateOne(filter, updateDoc, options);
        //     const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' })
        //     res.send({ result, token });
        // });


        // app.get('/products', async (req, res) => {
        //     const query = {};
        //     const cursor = collection.find(query);
        //     const services = await cursor.toArray();
        //     res.send(services);

        // });

        // app.get('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const service = await collection.findOne(query);
        //     res.send(service);
        // });
        // // //
        // app.post("/products", async (req, res) => {
        //     const newItem = req.body;
        //     // const tokenInfo = req.headers.authorization;
        //     // console.log(tokenInfo);
        //     const result = await collection.insertOne(newItem);
        //     res.send(result);
        // });

        // // // 
        // app.put('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             quantity: query.quantity,
        //         },
        //     };
        //     const result = await collection.updateOne(filter, updateDoc, options);
        //     res.send(result);
        // });
        //orders

        // app.get('/orders', async (req, res) => {
        //     const orders = await orderCollection.find().toArray();
        //     res.send(orders);
        // });
        // // Update quantity api
        // app.put("/orders/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const data = req.body;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             quantity: data.quantity,
        //         },
        //     };
        //     const result = await orderCollection.updateOne(
        //         filter,
        //         updateDoc,
        //         options
        //     );
        // res.send(result);
        // });
        //     app.post('/orders', async (req, res) => {
        //         const orders = req.body;
        //         const query = { orders: product, email: email, address: address, name: product.name }
        //         const exists = await orderCollection.findOne(query);
        //         if (exists) {
        //             return res.send({ success: false, order: exists })
        //         }
        //         const result = await orderCollection.insertOne(orders);
        //         return res.send({ success: true, result });
        //     });
        //     app.get("/orders/:email", async (req, res) => {
        //         const user = req.params.email
        //         const query = { email: user }
        //         const result = await orderCollection.find(query).toArray();
        //         res.send(result)
        //     });

        //     app.get("/orders", verifyJWT, async (req, res) => {
        //         const decodedEmail = req.decoded.email;
        //         const email = req.query.email;
        //         if (email === decodedEmail) {
        //             const query = { email: email };
        //             const cursor = orderCollection.find(query);
        //             const myItems = await cursor.toArray();
        //             res.send(myItems);
        //         } else {
        //             res.status(403).send({ message: "forbidden access" });
        //         }
        //     });

        //     // Delete MyItem api
        //     app.delete("/orders/:id", async (req, res) => {
        //         const id = req.params.id;
        //         const query = { _id: ObjectId(id) };
        //         const result = await collection.deleteOne(query);
        //         res.send(result);
        //     });
        app.get('/', (req, res) => {
            res.send('Hello Best Tools co. !')
        })

        app.listen(port, () => {
            console.log(` Best Tools co. listening on port ${port}`)
        })
    }

    finally {

    }
}
run().catch(console.dir);







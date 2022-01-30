const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId
require('dotenv').config();
const cors = require('cors');

// middlewire
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kcpm4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);


async function run() {
    try {
        await client.connect();
        const database = client.db('jhamdani-creation');
        const productsCollection = database.collection('products');
        const allproductsCollection = database.collection('allproducts');
        const reviewsCollection = database.collection('reviews');
        const ordersCollection = database.collection('orders');
        const usersCollection = database.collection('users');

        // post products api
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result);
        });


        // get products api
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({ "color": "white" });
            const products = await cursor.toArray();
            res.send(products);
        });


        // post allproducts api
        app.post('/allproducts', async (req, res) => {
            const allproducts = req.body;
            const result = await allproductsCollection.insertOne(allproducts);
            res.json(result);
        });

        // get allproducts api
        app.get('/allproducts', async (req, res) => {
            const cursor = allproductsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
            console.log(products)
        });



        // post review api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        });


        // get review api
        app.get('/reviews', async (req, res) => {
            const cursor = reviewsCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        });


        // post user api
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });


        app.put('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        })

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })





        // add orders api
        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.send(result);
        });

        // my orders
        app.get('/orders/:email', async (req, res) => {
            const result = await ordersCollection.find({ email: req.params.email }).toArray();
            res.send(result);
        });

        // cancel orders
        app.delete("/deleteorders/:id", async (req, res) => {
            // console.log(req.params.id)
            const result = await ordersCollection.deleteOne({
                _id: ObjectId(req.params.id)
            });
            res.send(result);
        });

        // get all orders
        app.get('/orders', async (req, res) => {
            const result = await ordersCollection.find({}).toArray();
            res.send(result);
        })

        // update status
        app.put('/updatestatus/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const updateStatus = req.body.status;
            console.log(updateStatus)
            const filter = { _id: ObjectId(id) };
            const result = await ordersCollection.updateOne(filter, {
                $set: { status: updateStatus }
            })
            console.log(result)
            res.send(result);
        })

        //   products delete
        app.delete("/deleteproducts/:id", async (req, res) => {
            console.log(req.params.id)
            const result = await allproductsCollection.deleteOne({
                _id: ObjectId(req.params.id)
            });
            res.send(result);
            console.log(result)
        });

    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('running')
})

app.listen(port, () => {
    console.log(port);
})
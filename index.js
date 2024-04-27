const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware============
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.htex290.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const snowyArtCollection = client
      .db('snowyArtDB')
      .collection('art-and-craft');
    const snowyArCategoriestCollection = client
      .db('snowyArtDB')
      .collection('art-and-craft-categories');

    // Art And Craft Item Post Method
    app.post('/add-art-craft-items', async (req, res) => {
      const newItem = req.body;
      console.log(newItem);
      // Create a document to insert
      // const doc = {
      //   itemName: newItem.itemName,
      //   category: newItem.category,
      //   processing_time: newItem.processing_time,
      //   customization: newItem.customization,
      //   stockStatus: newItem.stockStatus,
      //   rating: newItem.rating,
      //   price: newItem.price,
      //   photo: newItem.photo,
      //   description: newItem.description,
      // };
      // Insert the defined document into the "haiku" collection
      const result = await snowyArtCollection.insertOne(newItem);
      res.send(result);
    });

    // Art and Craft Item Read method
    app.get('/all-art-craft-items', async (req, res) => {
      const cursor = snowyArtCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    // Art and Craft Item Categories Read method
    app.get('/art-craft-items-categories', async (req, res) => {
      const cursor = snowyArCategoriestCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log(
      'Pinged your deployment. You successfully connected to MongoDB!'
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

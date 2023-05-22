const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

//wS5GsNu1XNkJV7kk
//toy-marketplace


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.75vrxdv.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const toyCollection = client.db('toy-marketplace').collection('addToy');

    app.get('/addToy', async(req,res) =>{
        let query ={};
        if(req.query?.email){
          query = {email: req.query.email}
        }
        else if(req.query?.toyName){
          query = {toyName : req.query.toyName}
        }
        
        const result = await toyCollection.find(query).limit(20).toArray();
        res.send(result);
      })

     //all toys
      app.get('/addToy/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await toyCollection.findOne(query);
        res.send(result);
      })


      app.delete('/addToy/:id', async(req,res)=>{
        const id = req.params.id;
        console.log(id);
        const query = {_id: new ObjectId(id)}
        const result = await toyCollection.deleteOne(query);
        res.send(result);
    })

    // app.patch('/addToy/:id', async(req,res)=>{
    //   const id = req.params.id;
    //   const filter = {_id: new ObjectId(id)};
    //   const updatedToy = req.body;
    //   console.log(updatedToy);
    //   const updateDoc = {
    //     $set: {
    //       status: updatedToy.status
    //     },
    //   };
    //   const result = await toyCollection.updateOne(filter, updateDoc);
    //   res.send(result);
    // })

    app.put('/addToy/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedToy = req.body;
      const toy = {
        $set: {
          quantity: updatedToy.quantity,      
          details: updatedToy.details,
          price: updatedToy.price
        }
      }
      const result = await toyCollection.updateOne(filter,toy, options);
      res.send(result);
    })

    app.post('/addToy', async(req,res) =>{
        const addToy = req.body;
        console.log(addToy);
        const result = await toyCollection.insertOne(addToy);
        res.send(result);
  
      });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Running the server');
})

app.listen(port, () => {
    console.log('Running from port', port);
})
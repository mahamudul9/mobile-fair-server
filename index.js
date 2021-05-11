const express = require('express')
const app = express()
app.use(express.json());
const cors=require('cors')
app.use(cors())
require('dotenv').config()

const ObjectID=require('mongodb').ObjectID;
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://mobileUser:1Mobile1Fair@cluster0.ywjyr.mongodb.net/mobileFairDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db("mobileFairDB").collection("mobiles");
  const userCollection = client.db("mobileFairDB").collection("users");
  const adminCollection = client.db("mobileFairDB").collection("admins");

  app.get('/', (req, res) => {
    res.send('Mobile Fair')
  })

  app.post('/addProduct', (req, res) => {
    const newData = req.body;
    console.log("adding  new product: ",newData);
    productCollection.insertOne(newData,{upsert: true})
    .then(result => console.log("result: ",result.insertedCount))
    res.send(insertedCount>0)
  })

  app.get('/products', (req, res) => {
    productCollection.find({})
    .toArray((err, items)=>{
      res.send(items);
    })
  })

  app.post('/addOrder', (req, res)=>{
    const order = req.body;
    userCollection.insertOne(order,{upsert: true})
    .then(result => console.log("Order: ",result))
    res.send(insertedCount>0)
  })

  app.get('/orders', (req, res) => {
    userCollection.find({})
    .toArray((err, items)=>{
      res.send(items);
    })
  })

  app.delete('/delete/:id', (req, res) => {
    const id= ObjectID(req.params.id);
    console.log("deleting item ",id);
    productCollection.findOneAndDelete({_id: id})
    .then(document=> res.send(document))
  })

  app.get('/admins', (req, res)=> {
    adminCollection.find({})
    .toArray((err, items)=>{
      res.send(items);
    })
  })
  
  console.log("you got error: ",err) 
});


const port= process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
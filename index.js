const express = require('express');

const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;



const uri = "mongodb+srv://organicUser:w3lXib4Hs2UlcU7X@cluster0.ckhne.mongodb.net/organigdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology:true });


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
})



client.connect(err => {
  const productCollection = client.db("organigdb").collection("products");
  
  app.get('/products', (req, res) => {
      productCollection.find({})
      .toArray( (err, document) => {
          res.send(document);
      })
  })


  app.get('/product/:id', (req, res) => {
      productCollection.find({_id: ObjectId(req.params.id)})
      .toArray ( (err, documents) => {
          res.send(documents[0])
      })
  })
    app.post("/addProduct", (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
        .then(result => {
            console.log("data added");
            res.redirect('/')
        })
    })
  
    app.patch('/update/:id', (req, res) =>{
        console.log(req.body.price);
        productCollection.updateOne({_id: ObjectId(req.params.id)},
        {
            $set: {price: req.body.price, quarntity: req.body.quarntity}
        })
        .then(result => {
            res.send(result.modifiedCount > 0);
        })
    })

    app.delete('/delete/:id', (req, res) => {
       productCollection.deleteOne({_id: ObjectId(req.params.id)})
       .then(result => {
           res.send(result.deletedCount > 0);
       })
    })

});


app.listen(3000, console.log("are you okay"));
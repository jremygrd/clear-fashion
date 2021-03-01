

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:clearfashion@cluster0.yuv3r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const fs = require('fs')


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run(query) {
  try {
    await client.connect();
    const db = client.db('clearfashion');
    const collection = db.collection('products');

    //normal query
    const result =await collection.find(query).toArray();


    //sort query
    //const result =await collection.find({},{_id:0}).sort({"price":1}).toArray()

    console.log(result);
  } finally {
    await client.close();
  }
}

//normal queries
const query = {brand: 'dedicated' };
//const query ={ price: { $lt: 20 } };
run(query).catch(console.dir);


//sort query
//run(null)
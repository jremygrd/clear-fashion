const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://admin:clearfashion@cluster0.yuv3r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const fs = require('fs')


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const db = client.db('clearfashion');
    

    const data = fs.readFileSync('products.json')
    //let products = JSON.stringify(JSON.parse(data));
    let i = JSON.parse(data)
    //console.log(i[0])

    let products = i[0] // We do it for 0,1 and 3 (my products.json wasn't built perfectly and i'm too lazy to do a loop for 3 indexes)
    let p = products
    console.log(p)

    const collection = db.collection('products');
    const result = await collection.insertMany(p);
    console.log(result);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);




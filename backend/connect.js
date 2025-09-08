
const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({ path: './config.env' });
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let database

module.exports = {
    connectToServer: async () => {
        try {
            await client.connect() // connect to mongodb
            database = client.db('Crud')  // select database
            console.log('Mongo DB Connect')
        } catch (err) {
            console.error('Mongo DB Error :)', err)
            process.exit(1)
        }
    },
    getDb: () => {
        if (!database) {
            throw new Error("database bot initialized")
        }
        return database
    }
}

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

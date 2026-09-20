import {MongoClient} from 'mongodb'

const URI = process.env.MONGODB_URI
const options ={}

if (!URI) throw new Error('Please add your Mongo URI to .env.local')

let client = new MongoClient(URI, options)
let clientPromise

if (process.env.NODE_ENV !== 'production') {
    if(!global._mongoClientPromise) {
        global._mongoClientPromise = client.connect()
    }

    clientPromise = global._mongoClientPromise
} else {
    clientPromise = client.connect()

}

export default clientPromise

// we are sharing the mongoclient in a global variable 
//so we avoid recreating this connection every time we wish to query out db
//if there is a connection established, we want to reuse that same connection 
// so were not exhausiting our connection pool
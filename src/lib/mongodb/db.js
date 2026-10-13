import {MongoClient} from 'mongodb'

const URI = process.env.MONGODB_URI
const options ={}

if (!URI) throw new Error('Please add your Mongo URI to .env.local')

/*
CHANGED 13 Oct 2026: a failed connection is no longer cached forever.

BEFORE: this file called client.connect() once and exported that promise.
If the very first connection failed (Wi-Fi blip, VPN, Atlas slow to respond),
the REJECTED promise was cached on `global._mongoClientPromise`, and every later
request awaited the same rejected promise. So the whole app said
"Failed to establish connection to database" until you restarted `npm run dev`,
even after the network was back.

NOW: we export a function, getMongoClient(), instead of a promise.
  - It still shares ONE connection (cached on `global` in dev, so hot reloads
    don't open new connections and exhaust the pool - same idea as before).
  - But if connecting fails, the cached promise is thrown away, so the NEXT
    request tries to connect again instead of failing instantly.
*/

// In development Next.js hot-reloads modules, which would reset a normal variable,
// so the cached promise lives on `global` there. In production a module variable is enough.
const cache = process.env.NODE_ENV !== 'production' ? global : {}


export default function getMongoClient() {
    if (!cache._mongoClientPromise) {
        const client = new MongoClient(URI, options)
        cache._mongoClientPromise = client.connect().catch((error) => {
            // NEW: forget the failed attempt so the next call retries
            cache._mongoClientPromise = undefined
            throw error
        })
    }
    return cache._mongoClientPromise
}

// we are sharing the mongoclient in a global variable
//so we avoid recreating this connection every time we wish to query out db
//if there is a connection established, we want to reuse that same connection
// so were not exhausiting our connection pool


// my actual notes from my reading/understadning 
/* 
1) basically node has two types of variables local variables which can only be accessed in the modules their defined or imported into
and global variables, which can be accessed in any file because they live on the actual process that everything runs on. some examples of global 
objects are console, process and global.

2) due to hotreloading/fast refresh everytime we make a edit to the db file or something that exports it, next would rerun all that code. 
this is bad because we would be establishing new connections to the database without closing the previous and quickly exhaust our connetion pool 

3)So what we are doing is in development we are setting our cache equal to the global object variable

4) so were storing our mongoDBclient promise in the global object e.g. cache so when we make changes to the utils or db 
we dont recreate a new conneciton, because the connection promise lives in the global object in the process and thus 
isnt subject to nextjs's fast refreshes. db.js still re-runs on every fast refresh, the glbal object doesn't stop the file running again, 
what it does is let the re-run find what the previous run left behind. 

5) the issue was to prevent constant connections being opened on every file change i would store the connection promise, in the global variable, 
however if the connection failed it would just store a rejected promise meaning every hot reload would still reference this rejected promise, 
now however in line 33 we've added a catch so that if the connetion is rejected the cache/global object no longer stores the rejected promise 


*/
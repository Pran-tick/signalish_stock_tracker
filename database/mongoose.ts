import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

declare global{
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if (!cached) {
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    if (!MONGODB_URI) throw new Error('MONGODB_URI must be set within .env file'); //if the MONGODB_URI is correct
    if (cached.conn) return cached.conn; //if the cache connection is alreadt there it will return the connection 
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }); //if there is no cached connection
    }
    try {
        cached.conn = await cached.promise //this will create a new cached connection if the above 3 conditions fails
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    console.log(`Connected to database ${process.env.NODE_ENV} - ${MONGODB_URI}`)

} //This function makes sure our aap connects to the database efficiently without creating multiple new connections due to hot relaod by nextjs server side activities and functions. 
//nextjs hot reload normally opens or create a new connection on every change and this function stores the function in global cache 
import mongoose, {Mongoose} from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as unknown).mongoose

if(!cached) {
    cached = (global as unknown).mongoose = {conn: null, promise: null}
}

export const connectToDatabase = async () => {
    if(cached.conn) {
        return cached.conn;
    }

    if(!cached.promise) {
        const opts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            bufferCommands: false,
            bufferMaxEntries: 0,
            useFindAndModify: false,
            useCreateIndex: true,
        }

        cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
            return mongoose;
        }).catch((err) => {
            console.error(err);
            throw err;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

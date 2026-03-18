import mongoose from 'mongoose';

const dbConnection = async () => {
    
    try {
        
        const db = await mongoose.connect(process.env.MONGO_URI);

        console.log(`Connected to ${db.connection.host}`);

    } catch (err) {

        console.error(`Error connecting db: ${err.message}`);
        process.exit(1);

    }

}

export default dbConnection;
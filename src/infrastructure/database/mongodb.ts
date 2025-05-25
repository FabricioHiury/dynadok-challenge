import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongo:27017/dynadok');
export default mongoose;
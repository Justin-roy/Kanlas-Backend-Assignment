import mongoose from 'mongoose';

export const connectDB = (uri: string) => {
    mongoose.connect(uri).then(() => {
        console.log("MongoDB Server Connected Successfully");
      })
      .catch((e) => {
        console.log(e);
      });;
}
import mongoose from "mongoose";

async function connectToDb() {
  const dbUri = process.env.DB_URI!;

  try {
    await mongoose.connect(dbUri);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
export default connectToDb;

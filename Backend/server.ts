// Load environment variables first
import dotenv from 'dotenv';
dotenv.config();

import app from "./src/app";
import connectDB from "./src/db/db";

connectDB();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});

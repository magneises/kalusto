import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';
import stockRoutes from "./routes/stockRoutes.js";
import Stock from "./models/Stock.js";



dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Failed:", err));

const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});

app.get('/', (req, res) => {
    res.send(`Server is running on PORT: ${PORT}`);
});

app.use("/api", stockRoutes);





// const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// if (!ALPHA_VANTAGE_API_KEY) {
//     console.error('Missing API key in .env file');
//     process.exit(1);
// }

// // Alpha Vantage API Route
// app.get('/api/stock/:symbol', async (req, res) => {
//     const { symbol } = req.params;
//     const url = `https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

//     try {
//         const response = await axios.get(url);
//         res.json(response.data);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch stock data' });
//     }
// });




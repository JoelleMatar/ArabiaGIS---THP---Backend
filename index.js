import express from 'express';
import mongoose from 'mongoose';
const app = express();
const PORT = 5000;
import userRouter from "./routes/index.js";
import cors from 'cors';

app.use(express.json());



app.use(cors());
app.use("/user", userRouter);

const connectionURL = "mongodb+srv://joelleM:123@accidents.jmls3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Connected to database');
});

mongoose.connection.on('error', (rr) => {
    console.log('Connection to database failed');
});

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


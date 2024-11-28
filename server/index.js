import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwtAuth from './routes/jwtAuth.route.js';
import sequelize from './db.js';
import errorMiddleware from './middlewares/error.middleware.js';

dotenv.config();

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use('/api', jwtAuth);
app.use(errorMiddleware);

const startServer = async () => {
    try {
        await sequelize.sync({alter: true});
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error('DB Error: ', error);
    }
};

startServer().then(() => console.log(1));

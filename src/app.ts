import express from 'express';
import cors from 'cors';
import Routes from './Routes/index.js';
import errorMiddleware from './middlewares/error.middleware.js';

//Se puede cargar lo que sea necesario antes de iniciar el server

const app = express();

app.use(express.json());
app.use(cors());

Routes(app);

app.use(errorMiddleware);
export default app;

import { ConnectDB } from './config/database.js';
import express from 'express';
import cors from 'cors';
import Routes from './Routes/index.js';
import env from './config/env.js';

//Se puede cargar lo que sea necesario antes de iniciar el server

const app = express();
export const port = env('PORT') || 3000;

app.use(express.json());
app.use(cors());

Routes(app);

app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
    await ConnectDB();
});

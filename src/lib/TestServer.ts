import express from 'express';
import cors from 'cors';
import env from '../config/env.js';

//se deja lo necesario para iniciar el server de pruebas con supertest, con esta configuración es suficiente para hacer las pruebas de integración
const app = express();
export const port = env('PORT') || 3000;

app.use(express.json());
app.use(cors());

export default app;

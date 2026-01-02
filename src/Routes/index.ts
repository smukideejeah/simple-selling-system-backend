import { Application } from 'express';
import V1 from './V1.js';

export default function (app: Application) {
    app.get('/', (req, res) => {
        res.send('Hello World!');
    });
    app.use('/v1', V1);
}

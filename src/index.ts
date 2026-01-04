import app from './app.js';
import env from './config/env.js';

export const port = env('PORT') || 3000;
app.listen(port, async () => {
    console.log(`Server is running at http://localhost:${port}`);
});

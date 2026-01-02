import env from './env.js';
import { Sequelize } from 'sequelize';

const dbuser = env('DB_USER') || 'root';
const dbpassword = env('DB_PASSWORD') || '';
const dbname = env('DB_NAME') || 'test';
const dbhost = env('DB_HOST') || 'localhost';
const dbport = parseInt(env('DB_PORT') || '3306');
export const sequelize = new Sequelize(dbname, dbuser, dbpassword, {
    dialect: 'mysql',
    host: dbhost,
    port: dbport,
    logging: false,
});

export async function ConnectDB() {
    for (let i = 0; i < 5; i++) {
        try {
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
            return;
        } catch (error) {
            console.error(
                `Unable to connect to the database (attempt ${i + 1}/5):`,
                error
            );
            await new Promise((res) => setTimeout(res, 5000));
        }
    }
    throw new Error('Unable to connect to the database after 5 attempts.');
}

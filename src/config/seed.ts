import Products from '../modules/Products/products.model.js';
import { execSync } from 'child_process';
import { sequelize } from './database.js';

(async () => {
    try {
        console.log('Seeding database...');
        const count = await Products.count();
        if (count == 0) {
            console.log('No products found, seeding initial data...');
            execSync('cd /app && npm run seed', { stdio: 'inherit' });
            console.log('Database seeded successfully.');
        }
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('Error during seeding:', error);
        process.exit(1);
    }
})();

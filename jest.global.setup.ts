import { execSync } from 'child_process';
export default async function globalSetup() {
    execSync('npm run db:reset', { stdio: 'inherit' });
    execSync('npm run db:s', { stdio: 'inherit' });
}

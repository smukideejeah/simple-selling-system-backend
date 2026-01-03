import { execSync } from 'node:child_process';

export default function () {
    execSync('npm run db:deploy', { stdio: 'inherit' });
    execSync('npm run db:s', { stdio: 'inherit' });
}

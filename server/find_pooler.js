const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const regions = [
  'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
  'eu-west-1', 'eu-west-2', 'eu-central-1', 'eu-west-3',
  'ap-south-1', 'ap-southeast-1', 'ap-southeast-2',
  'ap-northeast-1', 'ap-northeast-2', 'sa-east-1', 'ca-central-1'
];

const envPath = path.join(__dirname, '.env');
let currentEnv = fs.readFileSync(envPath, 'utf8');

// The user has something like postgresql://postgres:THEIRPASSWORD@db.rzat...
const match = currentEnv.match(/postgresql:\/\/postgres:(.*?)@db\.rzatpepkihjhyagnazvu\.supabase\.co:5432/);
if (!match) {
  console.log('Password match not found in .env!');
  process.exit(1);
}

const password = match[1];
console.log('Password acquired. Testing regions...');

let success = false;
for (const region of regions) {
  const testUrl = `postgresql://postgres.rzatpepkihjhyagnazvu:${password}@aws-0-${region}.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1`;
  
  process.stdout.write(`Testing ${region}... `);
  
  let newEnv = currentEnv.replace(/DATABASE_URL=".+"/, `DATABASE_URL="${testUrl}"`);
  fs.writeFileSync(envPath, newEnv);
  
  try {
    // Attempt prisma db pull (which verifies connection)
    execSync('npx prisma db pull', { stdio: 'ignore' });
    console.log('SUCCESS! \nRegion found: ' + region);
    
    // Push the schema to actualize it!
    console.log('Pushing schema to Supabase...');
    execSync('npx prisma db push', { stdio: 'inherit' });
    success = true;
    break;
  } catch (err) {
    console.log('Failed.');
  }
}

if (!success) {
  console.log('\nFailed to find valid region or authentication failed.');
  // Revert
  fs.writeFileSync(envPath, currentEnv);
  process.exit(1);
}

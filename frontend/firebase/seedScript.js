import { seedDatabase } from './seedData.js';

console.log('Starting seed process...');

// Run the seed function
seedDatabase()
  .then(() => {
    console.log('Seed completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error during seed process:', error);
    process.exit(1);
  }); 
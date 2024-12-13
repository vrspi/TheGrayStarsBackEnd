import runMigration from './migrations/20231213_create_music_table';

async function main() {
  try {
    await runMigration();
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

main();

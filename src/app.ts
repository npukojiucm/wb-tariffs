import cron from 'node-cron';
import { syncTariffs } from '#jobs/syncTariffs.js';


async function main() {
  console.log('Service started');

  await syncTariffs();

  cron.schedule('0 * * * *', async () => {
    await syncTariffs();
    console.log('Updated Tariffs from DB');
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

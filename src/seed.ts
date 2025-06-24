import { runSeeders } from 'typeorm-extension';
import { dataSource } from '../data-source';

(async () => {
  await dataSource.initialize();
  await runSeeders(dataSource);
  await dataSource.destroy();
})().catch((err) => {
  console.error(err);
  process.exit(1);
});

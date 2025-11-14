import { CronJob } from "cron";
import sync from "./sync.js";

const schedule = process.env.CRON_SCHEDULE || "0 23 * * *";

console.log(`Starting ActualT212Sync service using schedule: ${schedule}`);

const job = new CronJob(
  schedule,
  () => {
    sync().catch((error) => {
      console.error("Error during sync:", error);
    });
  }, // onTick
  null, // onComplete
  false, // start
  process.env.TZ || "UTC" // timeZone
);
job.start();

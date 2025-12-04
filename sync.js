import * as api from "@actual-app/api";
import fs from "fs";
import path from "path";

const dataDir = path.join(".", ".cache");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

export default async function sync() {
  console.log(`Syncing T212 with ActualBudget`);

  await api.init({
    dataDir: dataDir,
    serverURL: process.env.ACTUAL_URL,
    password: process.env.ACTUAL_PASSWORD,
  });

  await api.downloadBudget(process.env.ACTUAL_SYNC_ID);

  const accounts = await api.getAccounts();

  const account = await accounts.find((a) => a.name === process.env.ACTUAL_ACCOUNT_NAME);

  if (!account) throw new Error(`Account not found: ${process.env.ACTUAL_ACCOUNT_NAME}`);

  const currentActualBalance = await api.getAccountBalance(account.id);

  console.log(`Current ActualBudget balance: ${currentActualBalance / 100}`);

  const T212Request = await fetch("https://live.trading212.com/api/v0/equity/account/summary", {
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.T212_API_KEY}:${process.env.T212_API_SECRET}`).toString("base64")}`,
    },
  });

  const currentT212Data = await T212Request.json();
  const T212Balance = currentT212Data.totalValue;

  if (process.env.DEBUG.toLowerCase() === "true") {
    console.log("DEBUG: T212 API Response:", currentT212Data);
    console.log("DEBUG: T212 API Response Headers:", T212Request.headers);
  }

  if (T212Balance === undefined) {
    throw new Error("Failed to retrieve Trading 212 balance. Unexpected API response.");
  }

  console.log(`Current Trading 212 balance: ${T212Balance}`);

  const balanceChange = Math.floor(T212Balance * 100 - currentActualBalance);

  if (balanceChange === 0) {
    console.log("No balance adjustment required.");
    await api.shutdown();
    return;
  }

  console.log(`Adding balance adjustment of ${balanceChange / 100}`);

  await api.addTransactions(account.id, [
    {
      date: new Date(),
      amount: balanceChange,
    },
  ]);

  console.log("Balance change successfully added.");

  await api.shutdown();
}

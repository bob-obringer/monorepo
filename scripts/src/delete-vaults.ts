import {
  GlacierClient,
  ListVaultsCommand,
  InitiateJobCommand,
  DescribeJobCommand,
  GetJobOutputCommand,
  DeleteArchiveCommand,
  DeleteVaultCommand,
} from "@aws-sdk/client-glacier";
import { Readable } from "stream";

const client = new GlacierClient({ region: "us-east-1" });

const accountId = "315358515594";

const streamToString = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });

const waitForJobToComplete = async (vaultName: string, jobId: string) => {
  console.log(`Waiting for job ${jobId} to complete in vault ${vaultName}...`);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const describeJobCommand = new DescribeJobCommand({
      accountId,
      vaultName,
      jobId,
    });
    const { StatusCode } = await client.send(describeJobCommand);
    console.log(`Job ${jobId} status: ${StatusCode}`);
    if (StatusCode === "Succeeded") {
      console.log(`Job ${jobId} succeeded.`);
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 60000)); // wait for 1 minute
  }
};

const deleteVaults = async () => {
  console.log("Listing all vaults...");
  const listVaultsCommand = new ListVaultsCommand({ accountId });
  const { VaultList } = await client.send(listVaultsCommand);

  if (VaultList) {
    for (const vault of VaultList) {
      const vaultName = vault.VaultName!;
      console.log(`Processing vault: ${vaultName}`);

      // Initiate Inventory Retrieval Job
      console.log(
        `Initiating inventory retrieval job for vault ${vaultName}...`,
      );
      const initiateJobCommand = new InitiateJobCommand({
        accountId,
        vaultName,
        jobParameters: {
          Type: "inventory-retrieval",
        },
      });
      const { jobId } = await client.send(initiateJobCommand);
      console.log(`Inventory retrieval job initiated with jobId: ${jobId}`);

      // Wait for Job to Complete
      await waitForJobToComplete(vaultName, jobId!);

      // Get Job Output (Inventory)
      console.log(`Getting job output for jobId: ${jobId}...`);
      const getJobOutputCommand = new GetJobOutputCommand({
        accountId,
        vaultName,
        jobId,
      });
      const { body } = await client.send(getJobOutputCommand);
      const jobOutput = await streamToString(body as Readable);
      console.log(`Job output received for jobId: ${jobId}`);
      const inventory = JSON.parse(jobOutput);
      const ArchiveList = inventory.ArchiveList;

      // Delete Archives
      if (ArchiveList) {
        for (const archive of ArchiveList) {
          console.log(
            `Deleting archive: ${archive.ArchiveId} from vault ${vaultName}...`,
          );
          const deleteArchiveCommand = new DeleteArchiveCommand({
            accountId,
            vaultName,
            archiveId: archive.ArchiveId,
          });
          await client.send(deleteArchiveCommand);
          console.log(`Archive ${archive.ArchiveId} deleted.`);
        }
      } else {
        console.log(`No archives found in vault ${vaultName}.`);
      }

      // Delete Vault
      console.log(`Deleting vault: ${vaultName}...`);
      const deleteVaultCommand = new DeleteVaultCommand({
        accountId,
        vaultName,
      });
      await client.send(deleteVaultCommand);
      console.log(`Vault ${vaultName} deleted.`);
    }
  } else {
    console.log("No vaults found.");
  }
};

deleteVaults().catch(console.error);

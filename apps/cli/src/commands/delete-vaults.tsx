import { useEffect, useState, useRef, useCallback } from "react";
import { Box, Text, useApp } from "ink";
import { ProgressBar } from "../components/progress-bar.js";
import {
  JobStatusTable,
  type JobStatus,
} from "../components/job-status-table.js";
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
// eslint-disable-next-line @bob-obringer/no-process-env
const accountId = process.env.AWS_ACCOUNT_ID;
if (!accountId) {
  throw new Error("AWS_ACCOUNT_ID environment variable is not set");
}

const streamToString = (stream: Readable): Promise<string> =>
  new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });

const waitForJobToComplete = async (
  vaultName: string,
  jobId: string,
  updateStatus: (msg: string) => void,
) => {
  updateStatus(`Waiting for job ${jobId} to complete in vault ${vaultName}...`);

  while (true) {
    const describeJobCommand = new DescribeJobCommand({
      accountId,
      vaultName,
      jobId,
    });
    const { StatusCode } = await client.send(describeJobCommand);
    updateStatus(`Job ${jobId} status: ${StatusCode}`);
    if (StatusCode === "Succeeded") {
      updateStatus(`Job ${jobId} succeeded.`);
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 60000)); // wait for 1 minute
  }
};

export function DeleteVaults() {
  const { exit } = useApp();
  const [vaults, setVaults] = useState<unknown[]>([]); // List of all vaults
  const [activeJobs, setActiveJobs] = useState<JobStatus[]>([]); // Up to 3 active jobs
  const [completed, setCompleted] = useState<JobStatus[]>([]); // Completed jobs
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const concurrency = 3;
  const runningJobs = useRef(0);
  const totalJobs = useRef(0);
  const queueRef = useRef<unknown[]>([]);

  // @ts-expect-error don't care
  const processVault = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (vault: any) => {
      const vaultName = vault.VaultName;
      const updateStatus = (status: string) => {
        setActiveJobs((jobs) =>
          jobs.map((job) =>
            job.vaultName === vaultName ? { ...job, status } : job,
          ),
        );
      };
      setActiveJobs((jobs) => [...jobs, { vaultName, status: "Starting..." }]);
      try {
        updateStatus("Initiating inventory retrieval job...");
        const initiateJobCommand = new InitiateJobCommand({
          accountId,
          vaultName,
          jobParameters: { Type: "inventory-retrieval" },
        });
        const { jobId } = await client.send(initiateJobCommand);
        updateStatus(`Job initiated: ${jobId}`);
        await waitForJobToComplete(vaultName, jobId!, updateStatus);
        updateStatus("Getting job output...");
        const getJobOutputCommand = new GetJobOutputCommand({
          accountId,
          vaultName,
          jobId,
        });
        const { body } = await client.send(getJobOutputCommand);
        const jobOutput = await streamToString(body as Readable);
        updateStatus("Inventory retrieved");
        const inventory = JSON.parse(jobOutput);
        const ArchiveList = inventory.ArchiveList;
        if (ArchiveList && ArchiveList.length > 0) {
          for (const archive of ArchiveList) {
            updateStatus(`Deleting archive: ${archive.ArchiveId}`);
            const deleteArchiveCommand = new DeleteArchiveCommand({
              accountId,
              vaultName,
              archiveId: archive.ArchiveId,
            });
            await client.send(deleteArchiveCommand);
          }
        } else {
          updateStatus("No archives in vault");
        }
        updateStatus("Deleting vault...");
        const deleteVaultCommand = new DeleteVaultCommand({
          accountId,
          vaultName,
        });
        await client.send(deleteVaultCommand);
        updateStatus("Vault deleted!");
        setCompleted((prev) => [...prev, { vaultName, status: "Deleted" }]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        updateStatus("Error: " + (err?.message || String(err)));
        setCompleted((prev) => [...prev, { vaultName, status: "Error" }]);
      } finally {
        setActiveJobs((jobs) =>
          jobs.filter((job) => job.vaultName !== vaultName),
        );
        runningJobs.current -= 1;
        // Do NOT slice the queue here! Only do it in maybeStartNext.
        maybeStartNext(); // Try to start more jobs if possible
      }
    },
    // @ts-expect-error don't care
    [maybeStartNext],
  );

  // Parallel job runner
  // Job runner, not dependent on React state for queue
  // @ts-expect-error don't care
  const maybeStartNext = useCallback(() => {
    if (
      runningJobs.current >= concurrency ||
      queueRef.current.length === 0 ||
      done
    )
      return;
    while (runningJobs.current < concurrency && queueRef.current.length > 0) {
      const nextVault = queueRef.current.shift();
      runningJobs.current += 1;
      processVault(nextVault);
    }
  }, [done, processVault]);

  useEffect(() => {
    async function start() {
      try {
        const listVaultsCommand = new ListVaultsCommand({ accountId });
        const { VaultList } = await client.send(listVaultsCommand);
        if (!VaultList || VaultList.length === 0) {
          setDone(true);
          return;
        }
        setVaults(VaultList);
        queueRef.current = [...VaultList];
        totalJobs.current = VaultList.length;
        maybeStartNext(); // Start jobs immediately after vaults are fetched
      } catch (err: Error | unknown) {
        setError(
          err instanceof Error ? err?.message || String(err) : String(err),
        );
        setDone(true);
      }
    }
    start();
  }, [maybeStartNext]);

  // No duplicate maybeStartNext here. All logic is above.
  useEffect(() => {
    maybeStartNext();
    if (
      activeJobs.length === 0 &&
      queueRef.current.length === 0 &&
      completed.length === totalJobs.current &&
      vaults.length > 0
    ) {
      setDone(true);
    }
    // eslint-disable-next-line
  }, [activeJobs, completed, done, vaults]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (done) {
      timer = setTimeout(() => exit(), 2000);
    }
    return () => clearTimeout(timer);
  }, [done, exit]);

  // Progress bar and display
  const vaultsRemaining = queueRef.current.length + activeJobs.length;
  // @ts-expect-error don't care
  const next10 = queueRef.current.slice(0, 10).map((v) => v.VaultName);

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="cyan" bold>
        Vault Deletion Progress:
      </Text>
      <ProgressBar value={completed.length} total={totalJobs.current} />
      <Text color="yellow">Vaults remaining: {vaultsRemaining}</Text>
      <JobStatusTable jobs={activeJobs} max={3} />
      <Box flexDirection="column" marginBottom={1}>
        <Text bold>Next up:</Text>
        {next10.map((name, i) => (
          <Text key={name + i} color="gray">
            - {name}
          </Text>
        ))}
      </Box>
      {error && <Text color="red">Error: {error}</Text>}
      {done && <Text color="green">Done! Exiting...</Text>}
    </Box>
  );
}

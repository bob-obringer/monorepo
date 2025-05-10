import React from "react";
import { Box, Text } from "ink";

export interface JobStatus {
  vaultName: string;
  status: string;
}

interface JobStatusTableProps {
  jobs: JobStatus[];
  max?: number;
}

export const JobStatusTable: React.FC<JobStatusTableProps> = ({ jobs, max = 3 }) => {
  const displayJobs = jobs.slice(0, max);
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Box>
        <Text bold color="yellow">Active Jobs:</Text>
      </Box>
      <Box>
        <Text bold>Vault Name           Status</Text>
      </Box>
      {displayJobs.map((job, i) => (
        <Box key={job.vaultName + i}>
          <Text>{job.vaultName.padEnd(20)} {job.status}</Text>
        </Box>
      ))}
    </Box>
  );
};

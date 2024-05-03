import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { env } from "@/config/server";

export const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: env.aws.accessKeyId,
    secretAccessKey: env.aws.secretAccessKey,
  },
});

export async function getFileContents(key: string): Promise<string | null> {
  const params = {
    Bucket: env.aws.bucketName,
    Key: key,
  };

  try {
    const data = await s3.send(new GetObjectCommand(params));
    const stream = data.Body as ReadableStream;
    const response = new Response(stream);
    const buffer = await response.arrayBuffer();
    return new TextDecoder("utf-8").decode(buffer);
  } catch (err) {
    console.log("Error", err);
    return null;
  }
}

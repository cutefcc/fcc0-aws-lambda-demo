import {
  PutObjectAclCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from "@aws-sdk/client-s3";
import fetch from "node-fetch";
const uploadFileToBucket = async (imageName: string, imageURI: string) => {
  // base64 + http url
  const s3Client = new S3Client({ region: "us-west-2" });
  const result = {
    msg: "Uploading",
    bucketUrl: "",
  };
  let buf: Buffer | undefined = undefined;
  try {
    if (imageURI.startsWith("data:")) {
      buf = Buffer.from(imageURI.split(";base64,").pop() as string, "base64");
    }
    if (imageURI.startsWith("http://") || imageURI.startsWith("https://")) {
      const fimg = await fetch(imageURI);
      buf = Buffer.from(await fimg.arrayBuffer());
    }
    const params: PutObjectCommandInput = {
      Bucket: "fcc0bucket0",
      ContentType: "image/png",
      Key: imageName,
      Body: buf,
    };
    await s3Client.send(new PutObjectCommand(params));
    result.msg = "uploaded";
    result.bucketUrl = `https://fcc0bucket0.s3.us-west-2.amazonaws.com/${imageName}`;
  } catch (err) {
    console.log(err);
  }
  return result;
};
export default uploadFileToBucket;

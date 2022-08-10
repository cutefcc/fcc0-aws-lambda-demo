import {
  APIGatewayEvent,
  Context,
  APIGatewayProxyCallback,
  APIGatewayProxyResult,
} from "aws-lambda";
import uploadFileToBucket from "./s3Client";

type ApiEventType = {
  imageName: string;
  imageURI: string;
};

export const handler = async (
  event: APIGatewayEvent,
  context: Context,
  callback: APIGatewayProxyCallback
): Promise<{
  statusCode: number;
  message: string;
  bucketImgUrl: string;
}> => {
  const apiEvent = event as unknown as ApiEventType;
  console.log(`Event: ${JSON.stringify(event, null, 2)}`);
  console.log(`Context: ${JSON.stringify(context, null, 2)}`);
  let statusCode = 200;
  let message = "success";
  let bucketImgUrl = "";
  const { imageName, imageURI } = apiEvent;
  const { msg, bucketUrl } = await uploadFileToBucket(imageName, imageURI);
  if (msg === "uploaded") {
    bucketImgUrl = bucketUrl;
  } else {
    statusCode = 500;
    message = msg;
  }
  return {
    statusCode,
    message,
    bucketImgUrl,
  };
};

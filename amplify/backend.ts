import { defineBackend } from "@aws-amplify/backend";
import { data } from "./data/resource";
import { firstBucket, secondBucket, storage} from "./storage/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";
import { Stack } from 'aws-cdk-lib';


const backend = defineBackend({
  auth,
  data,
  firstBucket,
  secondBucket,
  storage,
});

const bedrockDataSource = backend.data.resources.graphqlApi.addHttpDataSource(
  "bedrockDS",
  "https://bedrock-runtime.us-east-1.amazonaws.com",
  {
    authorizationConfig: {
      signingRegion: "us-east-1",
      signingServiceName: "bedrock",
    },
  }
);

bedrockDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      "arn:aws:bedrock:us-east-1::foundation-model/anthropic.claude-3-sonnet-20240229-v1:0",
    ],
    actions: ["bedrock:InvokeModel"],
    
  })
);

const dataStack = Stack.of(backend.data)

// Set environment variables for the S3 Bucket name
backend.data.resources.cfnResources.cfnGraphqlApi.environmentVariables = {
 S3_BUCKET_NAME: backend.storage.resources.bucket.bucketName,
};

const rekognitionDataSource = backend.data.addHttpDataSource(
 "RekognitionDataSource",
 `https://rekognition.eu-west-1.amazonaws.com`,
 {
   authorizationConfig: {
     signingRegion: "eu-west-1",
     signingServiceName: "rekognition",
   },
 }
);

rekognitionDataSource.grantPrincipal.addToPrincipalPolicy(
 new PolicyStatement({
   actions: ["rekognition:DetectText", "rekognition:DetectLabels"],
   resources: ["*"],
 })
);

backend.storage.resources.bucket.grantReadWrite(
 rekognitionDataSource.grantPrincipal
);
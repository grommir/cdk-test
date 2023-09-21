import * as cdk from 'aws-cdk-lib';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { aws_s3 as s3 } from 'aws-cdk-lib';
import { BlockPublicAccess } from 'aws-cdk-lib/aws-s3';


export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const Bucket = new s3.Bucket(this, 'MyFirstBucket', {
      bucketName: `${this.account}-test-bucket`,
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      blockPublicAccess: BlockPublicAccess.BLOCK_ACLS,
      publicReadAccess: true
    });

    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('./website')],
      destinationBucket: Bucket
    });

    new cdk.CfnOutput(this, 'BucketName', { value: Bucket.bucketName });


  }
}

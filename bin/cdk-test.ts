#!/usr/bin/env node
// import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

import { infrastructureBase } from "../lib/infra-stack";
import { ec2Instance } from "../lib/ec2-stack";
import { localZone } from "../lib/route53-local-stack";

const app = new cdk.App();

const environment = process.env.ENV || "dev";
const sshPubKeyName =
  process.env.SSH_KEY_NAME || `${environment}-infra-main-key`;
const awsRegion = process.env.CDK_DEFAULT_REGION || "us-east-1";
const awsAccount = process.env.CDK_DEFAULT_ACCOUNT || "149345317534";

// Base infrastructure stack. Will contain VPC, route tables, peering etc.
const infraBase = new infrastructureBase(
  app,
  `${environment}-infra`,
  {
    environment: environment,
    vpcCidr: "172.16.0.0/16",
    cidrMask: 26,
  },
  { env: { region: awsRegion, account: awsAccount } },
);

// Local DNS zone for internal adresses
const localZonesite = new localZone(
  app,
  `${environment}-local-zone`,
  {
    environment: environment,
    vpc: infraBase.vpc,
  },
  { env: { region: awsRegion, account: awsAccount } },
);

new ec2Instance(
  app,
  `${environment}-worker`,
  {
    environment: environment,
    vpc: infraBase.vpc,
    machineImage: new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
    }),
    instanceType: ec2.InstanceType.of(
      ec2.InstanceClass.BURSTABLE2,
      ec2.InstanceSize.MICRO,
    ),
    route53Zone: localZonesite.localZone,
    sshSecurityGroup: infraBase.sshSecurityGroup,
    sshPubKeyName: sshPubKeyName,
  },
  { env: { region: awsRegion, account: awsAccount } },
);

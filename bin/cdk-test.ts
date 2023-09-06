#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

import { infrastructureBase } from "../lib/infra-stack";
import { ec2Instance } from "../lib/ec2-stack";
import { localZone } from "../lib/route53-local-stack";

const app = new cdk.App();
const env = process.env.ENV || "dev";

// Base infrastructure stack. Will contain VPC, route tables, peering etc.
const infraBase = new infrastructureBase(app, `${env}-infra`, {
  env: env,
  vpcCidr: "172.16.0.0/16",
  cidrMask: 26,
});

const localZonesite = new localZone(app, `${env}-local-zone`, {
  env: env,
  vpc: infraBase.vpc,
});

new ec2Instance(app, `${env}-worker`, {
  env: env,
  vpc: infraBase.vpc,
  machineImage: new ec2.AmazonLinuxImage({ generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  route53Zone: localZonesite.localZone
});

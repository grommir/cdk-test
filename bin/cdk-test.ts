#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { infrastructureBase } from "../lib/infra-stack";

const app = new cdk.App();
const env = process.env.ENV || "dev";

const infraBase = new infrastructureBase(app, {
  env: env,
  vpcCidr: "172.16.0.0/16",
  cidrMask: 26,
});

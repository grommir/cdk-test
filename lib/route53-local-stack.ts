import * as cdk from "aws-cdk-lib";
import { aws_route53 as route53 } from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export interface CustomProps {
  env: string;
  vpc: ec2.Vpc;
}

export class localZone extends cdk.Stack {
  public readonly localZone: route53.HostedZone;
  constructor(scope: cdk.App, id: string, props: CustomProps) {
    super(scope, id);

    this.localZone = new route53.HostedZone(this, "localZone", {
      zoneName: `${props.env}.local`,
      vpcs: [props.vpc],
    });
  }
}

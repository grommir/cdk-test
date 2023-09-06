import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export interface CustomProps {
  env: string;
  vpcCidr?: string;
  cidrMask?: number;
}

export class infrastructureBase extends cdk.Stack {
  constructor(scope: cdk.App, props: CustomProps) {
    super(scope);

    const cidrMask = props.cidrMask || 24;
    const vpcCidr = props.vpcCidr || "10.0.0.0/16";

    const vpc = new ec2.Vpc(this, "Vpc", {
      ipAddresses: ec2.IpAddresses.cidr(vpcCidr),
      vpcName: `${props.env}-VPC`,
      subnetConfiguration: [
        {
          name: "public-subnet",
          subnetType: ec2.SubnetType.PUBLIC,
          cidrMask: cidrMask,
        },
        {
          name: "private-subnet",
          subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
          cidrMask: cidrMask,
        },
        {
          name: "private-isolated",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: cidrMask,
        },
      ],
    });
  }
}

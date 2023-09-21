import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { SecurityGroup, Peer, Port } from "aws-cdk-lib/aws-ec2";

export interface CustomProps {
  environment: string;
  vpcCidr?: string;
  cidrMask?: number;
}

export class infrastructureBase extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly sshSecurityGroup: SecurityGroup;
  constructor(
    scope: cdk.App,
    id: string,
    props: CustomProps,
    stackProps?: cdk.StackProps,
  ) {
    super(scope, id, stackProps);

    const cidrMask = props.cidrMask || 24;
    const vpcCidr = props.vpcCidr || "10.0.0.0/16";

    this.vpc = new ec2.Vpc(this, "Vpc", {
      ipAddresses: ec2.IpAddresses.cidr(vpcCidr),
      vpcName: `${props.environment}-VPC`,
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

    // Create a security group for SSH
    this.sshSecurityGroup = new SecurityGroup(this, "SSHSecurityGroup", {
      vpc: this.vpc,
      description: "Security Group for SSH",
      allowAllOutbound: true,
    });
    this.sshSecurityGroup.addIngressRule(Peer.anyIpv4(), Port.tcp(22));

    // Generate SSH key for environment
    new ec2.CfnKeyPair(this, "MainKeyPair", {
      keyName: `${id}-main-key`,
    });
  }
}

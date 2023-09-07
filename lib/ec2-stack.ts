import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { aws_route53 as route53 } from "aws-cdk-lib";
import { SecurityGroup } from "aws-cdk-lib/aws-ec2";

export interface CustomProps {
  environment: string;
  vpc: ec2.Vpc;
  machineImage: ec2.IMachineImage;
  instanceType: ec2.InstanceType;
  route53Zone: route53.HostedZone;
  sshSecurityGroup: SecurityGroup;
  sshPubKeyName: string;
}

export class ec2Instance extends cdk.Stack {
  public readonly ec2Instance: ec2.Instance;
  constructor(
    scope: cdk.App,
    id: string,
    props: CustomProps,
    stackProps?: cdk.StackProps,
  ) {
    super(scope, id, stackProps);

    const ec2InstanceSecurityGroup = new SecurityGroup(
      this,
      "ec2InstanceSecurityGroup",
      { vpc: props.vpc, allowAllOutbound: true },
    );

    this.ec2Instance = new ec2.Instance(this, "Instance", {
      vpc: props.vpc,
      instanceType: props.instanceType,
      machineImage: props.machineImage,
      securityGroup: ec2InstanceSecurityGroup,
      keyName: props.sshPubKeyName,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
    });

    this.ec2Instance.addSecurityGroup(props.sshSecurityGroup);

    new route53.ARecord(this, "ARecord", {
      zone: props.route53Zone,
      recordName: `${id}.${props.environment}.local`,
      target: route53.RecordTarget.fromIpAddresses(
        this.ec2Instance.instancePrivateIp,
      ),
    });
  }
}

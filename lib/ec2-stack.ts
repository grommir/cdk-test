import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { aws_route53 as route53} from "aws-cdk-lib";

export interface CustomProps {
  env: string;
  vpc: ec2.Vpc;
  machineImage: ec2.IMachineImage;
  instanceType: ec2.InstanceType;
  route53Zone: route53.HostedZone
}

export class ec2Instance extends cdk.Stack {
  public readonly ec2Instance: ec2.Instance;
  constructor(scope: cdk.App, id: string, props: CustomProps) {
    super(scope, id);

    this.ec2Instance = new ec2.Instance(this, 'Instance', {
      vpc: props.vpc,
      instanceType: props.instanceType,
      machineImage: props.machineImage,
    });

    new route53.ARecord(this, 'ARecord', {
      zone: props.route53Zone,
      recordName: `${id}.${props.env}.local`,
      target: route53.RecordTarget.fromIpAddresses(this.ec2Instance.instancePrivateIp),
    });

  }
}

import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export interface CustomProps {
  env: string;
  vpc: ec2.Vpc;
  machineImage: ec2.IMachineImage;
  instanceType: ec2.InstanceType;
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

  }
}

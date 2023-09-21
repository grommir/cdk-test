import { CfnOutput, Fn, Duration, RemovalPolicy } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";

export interface CustomProps {
  environment: string;
  vpc: ec2.Vpc;
  subnetIds: string[];
  dbName?: string;
  instanceType?: any;
  engineVersion?: any;
  username?: string;
  ingressSources: any[];
  backupWindow?: string;
  preferredMaintenanceWindow?: string;
}

export class rdsInstance extends cdk.Stack {
  constructor(
    scope: cdk.App,
    id: string,
    props: CustomProps,
    stackProps?: cdk.StackProps,
  ) {
    super(scope, id, stackProps);

    // default database username
    var dbUsername = "dbadmin";
    if (typeof props.username !== "undefined") {
      dbUsername = props.username;
    }
    var engineVersion = rds.PostgresEngineVersion.VER_13_12;
    if (typeof props.engineVersion !== "undefined") {
      engineVersion = props.engineVersion;
    }

    const subnets: any[] = [];

    for (let subnetId of props.subnetIds!) {
      const subid = subnetId.replace("_", "").replace(" ", "");
      subnets.push(
        ec2.Subnet.fromSubnetAttributes(this, subid, {
          subnetId: subid,
        }),
      );
    }

    const vpcSubnets: ec2.SubnetSelection = {
      subnets: subnets,
    };

    const allAll = ec2.Port.allTraffic();
    const tcp5432 = ec2.Port.tcpRange(5432, 5432);

    const dbsg = new ec2.SecurityGroup(this, "DatabaseSecurityGroup", {
      vpc: props.vpc,
      allowAllOutbound: true,
      description: id + "Database",
      securityGroupName: id + "Database",
    });

    dbsg.addIngressRule(dbsg, allAll, "all from self");
    dbsg.addEgressRule(ec2.Peer.ipv4("0.0.0.0/0"), allAll, "all out");

    const dbConnectionPorts = [{ port: tcp5432, description: "tcp5432 DB" }];

    for (let ingressSource of props.ingressSources) {
      for (let c of dbConnectionPorts) {
        dbsg.addIngressRule(ingressSource, c.port, c.description);
      }
    }

    const dbSubnetGroup = new rds.SubnetGroup(this, "DatabaseSubnetGroup", {
      vpc: props.vpc,
      description: id + "subnet group",
      vpcSubnets: vpcSubnets,
      subnetGroupName: id + "subnet group",
    });

    const dbSecret = new secretsmanager.Secret(this, "dbCredentials", {
      secretName: props.dbName + "dbCredentials",
      description: props.dbName + "Database Crendetials",
      generateSecretString: {
        excludeCharacters: "\"@/\\ '",
        generateStringKey: "password",
        passwordLength: 30,
        secretStringTemplate: JSON.stringify({ username: dbUsername }),
      },
    });

    const dbCredentials = rds.Credentials.fromSecret(dbSecret, dbUsername);

    const dbParameterGroup = new rds.ParameterGroup(this, "ParameterGroup", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: engineVersion,
      }),
    });

    const dbInstance = new rds.DatabaseInstance(this, "Database", {
      databaseName: props.dbName,
      instanceIdentifier: props.dbName,
      credentials: dbCredentials,
      engine: rds.DatabaseInstanceEngine.postgres({
        version: engineVersion,
      }),
      backupRetention: Duration.days(7),
      allocatedStorage: 20,
      securityGroups: [dbsg],
      allowMajorVersionUpgrade: true,
      autoMinorVersionUpgrade: true,
      instanceType: props.instanceType,
      vpcSubnets: vpcSubnets,
      vpc: props.vpc,
      removalPolicy: RemovalPolicy.DESTROY,
      storageEncrypted: true,
      monitoringInterval: Duration.seconds(60),
      enablePerformanceInsights: true,
      parameterGroup: dbParameterGroup,
      subnetGroup: dbSubnetGroup,
      preferredBackupWindow: props.backupWindow,
      preferredMaintenanceWindow: props.preferredMaintenanceWindow,
      publiclyAccessible: false,
    });

    dbInstance.addRotationSingleUser();

    new CfnOutput(this, "dbEndpoint", {
      exportName: "dbEndPoint",
      value: dbInstance.dbInstanceEndpointAddress,
    });

    new CfnOutput(this, "dbUserName", {
      exportName: "dbUserName",
      value: dbUsername,
    });

    new CfnOutput(this, "dbDbName", {
      exportName: "dbDbName",
      value: props.dbName!,
    });
    //
  }
}

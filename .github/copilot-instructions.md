This repository defines a private AWS CDK environment composed of four cooperating stacks:
- base networking (`lib/infra-stack.ts`): VPC, subnet tiers, shared SSH security group, key pair
- private DNS (`lib/route53-local-stack.ts`): VPC-associated Route53 private hosted zone
- compute (`lib/ec2-stack.ts`): private EC2 instance, instance security group, internal A record
- database (`lib/rds-stack.ts`): PostgreSQL RDS in isolated subnets with Secrets Manager credentials and SG-based ingress controls

For full architecture details, Mermaid diagrams, resource relationships, data flows, and code navigation, see `docs/CODEBASE_MAP.md`.

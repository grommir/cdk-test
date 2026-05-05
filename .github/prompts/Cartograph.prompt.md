---
description: "Generate infrastructure diagram for CDK stack"
name: "Cartographer"
argument-hint: "Provide CDK stack file path or code"
agent: "agent"
tools: [vscode.mermaid-chat-features/renderMermaidDiagram]
---

Analyze the provided CDK stack code and generate a Mermaid diagram that visualizes the AWS resources and their relationships.

Focus on:
- EC2 instances, VPCs, subnets
- RDS databases
- Route53 records
- Security groups and their rules
- Any other AWS resources defined in the stack

Use graph TD for the diagram, with resources as nodes and connections as edges.

After generating the Mermaid markup, use the renderMermaidDiagram tool to render it with an appropriate title.

---
description: "Generate infrastructure diagram for CDK stack"
name: "Cartographer"
argument-hint: "Provide CDK stack file path or code"
agent: "agent"
tools: [vscode/toolSearch, read, agent, edit, search, vscode.mermaid-chat-features/renderMermaidDiagram]
---

Analyze the provided CDK stack code and generate a Mermaid diagram that visualizes the AWS resources and their relationships.

Focus on:
- EC2 instances, VPCs, subnets
- RDS databases
- Route53 records
- Security groups and their rules
- Any other AWS resources defined in the stack

Create a `docs/CODEBASE_MAP.md` with the detailed architecture map with file purposes, dependencies, data flows, and navigation guides

Update `.github/copilot-instructions.md` with a summary pointing to the map

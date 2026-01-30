#!/usr/bin/env tsx

import type { CreateMatrixWorkflowRequest } from '../src/types/matrix';

const API_BASE_URL = 'http://localhost:4005/api/v1';

const workflows: CreateMatrixWorkflowRequest[] = [
  {
    name: 'Customer Feedback Analysis',
    description: 'Analyzes customer feedback for sentiment, topics, and actionable insights',
  },
  {
    name: 'Invoice Processing',
    description: 'Extracts data from invoices, validates totals, and routes for approval',
  },
  {
    name: 'Monthly Sales Report',
    description: 'Generates comprehensive sales reports with charts and metrics',
  },
  {
    name: 'Content Moderation',
    description: 'Reviews user-generated content for policy compliance and safety',
  },
  {
    name: 'Document Summarization',
    description: 'Extracts key information and generates concise summaries from documents',
  },
  {
    name: 'Lead Qualification',
    description: 'Scores and qualifies sales leads based on multiple criteria',
  },
  {
    name: 'Email Classification',
    description: 'Categorizes and routes incoming emails to appropriate departments',
  },
  {
    name: 'Data Enrichment',
    description: 'Enriches customer records with additional data from multiple sources',
  },
];

async function seedWorkflows() {
  console.log('🌱 Seeding workflows to Matrix API...\n');

  for (const workflow of workflows) {
    try {
      const response = await fetch(`${API_BASE_URL}/workflows`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workflow),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Failed to create "${workflow.name}": ${error}`);
        continue;
      }

      const created = await response.json();
      console.log(`✅ Created: ${workflow.name} (${created.id})`);
    } catch (error) {
      console.error(`❌ Error creating "${workflow.name}":`, error);
    }
  }

  console.log('\n✨ Seeding complete!');
}

seedWorkflows().catch(console.error);

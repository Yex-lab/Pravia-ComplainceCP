#!/usr/bin/env tsx

import type { CreateMatrixKnowledgeBaseRequest } from '../src/types/matrix';

 
const API_BASE_URL = `http://localhost:4005/api/v1`;

const knowledgeBases: CreateMatrixKnowledgeBaseRequest[] = [
  {
    name: 'Product Documentation',
    description: 'Technical documentation, user guides, and API references for all products',
    embedding_model: 'text-embedding-3-small',
    storage_backend: 'local',
    vector_backend: 'pgvector',
  },
  {
    name: 'Customer Support KB',
    description: 'FAQs, troubleshooting guides, and support articles for customer service team',
    embedding_model: 'text-embedding-3-small',
    storage_backend: 'local',
    vector_backend: 'pgvector',
  },
  {
    name: 'Company Policies',
    description: 'HR policies, compliance documents, and internal procedures',
    embedding_model: 'text-embedding-3-large',
    storage_backend: 'local',
    vector_backend: 'pgvector',
  },
  {
    name: 'Legal Documents',
    description: 'Contracts, terms of service, privacy policies, and legal agreements',
    embedding_model: 'text-embedding-3-large',
    storage_backend: 'local',
    vector_backend: 'pgvector',
  },
  {
    name: 'Research Papers',
    description: 'Academic papers, whitepapers, and research findings',
    embedding_model: 'text-embedding-3-large',
    storage_backend: 'local',
    vector_backend: 'pgvector',
  },
  {
    name: 'Marketing Content',
    description: 'Blog posts, case studies, and marketing materials',
    embedding_model: 'text-embedding-3-small',
    storage_backend: 'local',
    vector_backend: 'pgvector',
  },
  {
    name: 'Training Materials',
    description: 'Employee onboarding guides, training videos, and learning resources',
    embedding_model: 'text-embedding-3-small',
    storage_backend: 'local',
    vector_backend: 'pgvector',
  },
  {
    name: 'Code Documentation',
    description: 'API docs, code examples, and developer guides',
    embedding_model: 'text-embedding-3-small',
    storage_backend: 'local',
    vector_backend: 'pgvector',
  },
];

async function seedKnowledgeBases() {
  console.log('🌱 Seeding knowledge bases to Matrix API...\n');

  for (const kb of knowledgeBases) {
    try {
      const response = await fetch(`${API_BASE_URL}/knowledge-bases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kb),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`❌ Failed to create "${kb.name}": ${error}`);
        continue;
      }

      const created = await response.json();
      console.log(`✅ Created: ${kb.name} (${created.id})`);
    } catch (error) {
      console.error(`❌ Error creating "${kb.name}":`, error);
    }
  }

  console.log('\n✨ Seeding complete!');
}

seedKnowledgeBases().catch(console.error);

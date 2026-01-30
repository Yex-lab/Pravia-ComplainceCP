import axios from 'axios';

const API_BASE_URL = 'http://localhost:4005/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function deleteAllWorkflows() {
  console.log('🗑️  Deleting existing workflows...');
  const { data } = await api.get('/workflows');
  for (const workflow of data.items) {
    await api.delete(`/workflows/${workflow.id}`);
    console.log(`   Deleted: ${workflow.name}`);
  }
}

async function seedWorkflowsWithSteps() {
  console.log('\n🌱 Seeding workflows with steps...\n');

  // Get available agents, tools, prompts
  const { data: agentsData } = await api.get('/agents');
  const { data: toolsData } = await api.get('/tools');
  const { data: promptsData } = await api.get('/prompts');

  const agents = agentsData.items;
  const tools = toolsData.items;
  const prompts = promptsData.items;

  if (agents.length === 0 || tools.length === 0) {
    console.error('❌ No agents or tools found. Please seed agents and tools first.');
    return;
  }

  const workflows = [
    {
      name: 'Customer Feedback Analysis',
      description: 'Analyzes customer feedback for sentiment, topics, and actionable insights',
      steps: [
        {
          name: 'Extract Feedback Text',
          agent_id: agents[0]?.id,
          tool_ids: [tools[0]?.id, tools[1]?.id].filter(Boolean),
          prompt_ids: prompts.slice(0, 1).map(p => p.id),
          timeout_seconds: 300,
        },
        {
          name: 'Analyze Sentiment',
          agent_id: agents[1]?.id || agents[0]?.id,
          tool_ids: [tools[2]?.id].filter(Boolean),
          prompt_ids: prompts.slice(1, 2).map(p => p.id),
          timeout_seconds: 180,
        },
        {
          name: 'Generate Summary Report',
          agent_id: agents[2]?.id || agents[0]?.id,
          tool_ids: [tools[3]?.id, tools[4]?.id].filter(Boolean),
          prompt_ids: prompts.slice(2, 3).map(p => p.id),
          timeout_seconds: 240,
        },
      ],
    },
    {
      name: 'Document Processing Pipeline',
      description: 'Extracts text from documents, summarizes content, and stores in knowledge base',
      steps: [
        {
          name: 'Extract Text from Document',
          agent_id: agents[0]?.id,
          tool_ids: [tools[0]?.id].filter(Boolean),
          prompt_ids: [],
          timeout_seconds: 300,
        },
        {
          name: 'Summarize Content',
          agent_id: agents[1]?.id || agents[0]?.id,
          tool_ids: [tools[1]?.id, tools[2]?.id].filter(Boolean),
          prompt_ids: prompts.slice(0, 1).map(p => p.id),
          timeout_seconds: 240,
        },
        {
          name: 'Store in Knowledge Base',
          agent_id: agents[2]?.id || agents[0]?.id,
          tool_ids: [tools[3]?.id].filter(Boolean),
          prompt_ids: [],
          timeout_seconds: 120,
        },
      ],
    },
    {
      name: 'Invoice Processing',
      description: 'Extracts data from invoices, validates totals, and routes for approval',
      steps: [
        {
          name: 'Extract Invoice Data',
          agent_id: agents[0]?.id,
          tool_ids: [tools[0]?.id, tools[1]?.id].filter(Boolean),
          prompt_ids: prompts.slice(1, 2).map(p => p.id),
          timeout_seconds: 180,
        },
        {
          name: 'Validate Calculations',
          agent_id: agents[1]?.id || agents[0]?.id,
          tool_ids: [tools[2]?.id].filter(Boolean),
          prompt_ids: [],
          timeout_seconds: 120,
        },
        {
          name: 'Route for Approval',
          agent_id: agents[2]?.id || agents[0]?.id,
          tool_ids: [tools[3]?.id].filter(Boolean),
          prompt_ids: prompts.slice(2, 3).map(p => p.id),
          timeout_seconds: 60,
        },
      ],
    },
    {
      name: 'Content Moderation',
      description: 'Reviews user-generated content for policy compliance and safety',
      steps: [
        {
          name: 'Extract Content',
          agent_id: agents[0]?.id,
          tool_ids: [tools[0]?.id].filter(Boolean),
          prompt_ids: [],
          timeout_seconds: 60,
        },
        {
          name: 'Check Against Policies',
          agent_id: agents[1]?.id || agents[0]?.id,
          tool_ids: [tools[1]?.id, tools[2]?.id].filter(Boolean),
          prompt_ids: prompts.slice(0, 2).map(p => p.id),
          timeout_seconds: 180,
        },
        {
          name: 'Generate Moderation Report',
          agent_id: agents[2]?.id || agents[0]?.id,
          tool_ids: [tools[3]?.id].filter(Boolean),
          prompt_ids: prompts.slice(2, 3).map(p => p.id),
          timeout_seconds: 120,
        },
      ],
    },
    {
      name: 'Research Assistant',
      description: 'Searches knowledge base, summarizes findings, and generates research report',
      steps: [
        {
          name: 'Search Knowledge Base',
          agent_id: agents[0]?.id,
          tool_ids: [tools[0]?.id, tools[1]?.id].filter(Boolean),
          prompt_ids: prompts.slice(0, 1).map(p => p.id),
          timeout_seconds: 240,
        },
        {
          name: 'Analyze and Synthesize',
          agent_id: agents[1]?.id || agents[0]?.id,
          tool_ids: [tools[2]?.id].filter(Boolean),
          prompt_ids: prompts.slice(1, 3).map(p => p.id),
          timeout_seconds: 300,
        },
        {
          name: 'Generate Research Report',
          agent_id: agents[2]?.id || agents[0]?.id,
          tool_ids: [tools[3]?.id, tools[4]?.id].filter(Boolean),
          prompt_ids: prompts.slice(2, 4).map(p => p.id),
          timeout_seconds: 240,
        },
      ],
    },
  ];

  for (const workflowData of workflows) {
    const { steps, ...workflowInfo } = workflowData;
    
    // Create workflow
    const { data: workflow } = await api.post('/workflows', workflowInfo);
    console.log(`✅ Created workflow: ${workflow.name}`);

    // Create steps
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepPayload = {
        name: step.name,
        step_order: i,
        agent_id: step.agent_id || undefined,
        tool_ids: step.tool_ids || [],
        prompt_ids: step.prompt_ids || [],
        timeout_seconds: step.timeout_seconds || 300,
      };
      await api.post(`/workflows/${workflow.id}/steps`, stepPayload);
      console.log(`   ✅ Added step ${i + 1}: ${step.name}`);
    }
    console.log('');
  }
}

async function main() {
  try {
    await deleteAllWorkflows();
    await seedWorkflowsWithSteps();
    console.log('✅ Seeding complete!\n');
  } catch (error: any) {
    console.error('❌ Error:', error.response?.data || error.message);
    process.exit(1);
  }
}

main();

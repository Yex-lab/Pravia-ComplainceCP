const users = [
  { email: 'luciana.moumary@farodevops.com', firstName: 'Luciana', lastName: 'Moumary' },
  { email: 'jassiel.galvan@innadvisory.com', firstName: 'Jassiel', lastName: 'Galvan' },
  { email: 'paresh.shah@farosoftware.com', firstName: 'Paresh', lastName: 'Shah' },
  { email: 'mike.primavera@farosoftware.com', firstName: 'Mike', lastName: 'Primavera' },
  { email: 'carlos.armenta@farodevops.com', firstName: 'Carlos', lastName: 'Armenta' },
  { email: 'lenen.estacio@farosoftware.com', firstName: 'Lenen', lastName: 'Estacio' },
  { email: 'mark.parry@farosoftware.com', firstName: 'Mark', lastName: 'Parry' },
  { email: 'jacob.samson@farosoftware.com', firstName: 'Jacob', lastName: 'Samson' },
  { email: 'allie.bowring@farosoftware.com', firstName: 'Allie', lastName: 'Bowring' },
  { email: 'craig.grivette@farosoftware.com', firstName: 'Craig', lastName: 'Grivette' }
];

const SUPABASE_URL = 'https://kcoscwspccqppdoqnsdm.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtjb3Njd3NwY2NxcHBkb3Fuc2RtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTcxMDE4NSwiZXhwIjoyMDcxMjg2MTg1fQ.Tu6TaFdIULaKk4_8SL_kS8Ux-EZ3aFmyNVLh5cft-_I';

async function createUser(user) {
  const payload = {
    email: user.email,
    password: 'P@ssword123',
    email_confirm: true,
    user_metadata: {
      first_name: user.firstName,
      last_name: user.lastName
    }
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log(`✓ Created: ${user.firstName} ${user.lastName} (${user.email})`);
      return data;
    } else {
      console.error(`✗ Failed: ${user.email} - ${JSON.stringify(data)}`);
      return null;
    }
  } catch (error) {
    console.error(`✗ Error: ${user.email} - ${error.message}`);
    return null;
  }
}

async function createAllUsers() {
  console.log('Creating 10 users in Supabase...\n');
  const results = [];
  
  for (const user of users) {
    const result = await createUser(user);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  const successful = results.filter(r => r !== null).length;
  console.log(`\nDone! Successfully created ${successful}/${users.length} users.`);
}

createAllUsers();

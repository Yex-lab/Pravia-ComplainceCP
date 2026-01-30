import { foundryServices } from '../../src/api/foundry.api';

async function queryRoles() {
  try {
    const roles = await foundryServices.roles.getRoles();
    console.log('Roles from Foundry API:');
    console.log(JSON.stringify(roles, null, 2));
  } catch (error) {
    console.error('Error fetching roles:', error);
  }
}

queryRoles();

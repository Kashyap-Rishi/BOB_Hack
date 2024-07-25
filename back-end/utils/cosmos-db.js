const { CosmosClient } = require('@azure/cosmos');
const { COSMOS_DB_ENDPOINT, COSMOS_DB_KEY, COSMOS_DB_DATABASE_ID, COSMOS_DB_CONTAINER_ID } = require('../config/config');

const client = new CosmosClient({ endpoint: COSMOS_DB_ENDPOINT, key: COSMOS_DB_KEY });

async function init() {
  try {
    
    const { database } = await client.databases.createIfNotExists({ id: COSMOS_DB_DATABASE_ID });
    console.log('Database created or already exists:', database.id);

   
    const { container } = await database.containers.createIfNotExists({ id: COSMOS_DB_CONTAINER_ID });
    console.log('Container created or already exists:', container.id);

    return container;
  } catch (error) {
    console.error('Failed to initialize Cosmos DB:', error.message);
  }
}

module.exports = {
  init,
};

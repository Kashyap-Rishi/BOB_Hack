require("dotenv").config();

module.exports = {
    COSMOS_DB_ENDPOINT:process.env.COSMOS_DB_ENDPOINT ,
    COSMOS_DB_KEY:process.env.COSMOS_DB_KEY ,
    COSMOS_DB_DATABASE_ID:process.env.COSMOS_DB_DATABASE_ID ,
    COSMOS_DB_CONTAINER_ID:process.env.COSMOS_DB_CONTAINER_ID ,
};
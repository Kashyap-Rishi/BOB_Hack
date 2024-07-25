const express = require('express');
const cors = require('cors');
const { init } = require('./utils/cosmos-db');
const routes = require("./routes/route");


const app = express();
const port = process.env.PORT || 3000;


app.use(cors());


app.use(express.json());


app.use(express.urlencoded({ extended: true }));


init().then(container => {
  
  app.locals.container = container;

 
 app.use(routes)

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to initialize Cosmos DB', err);
  process.exit(1);
});

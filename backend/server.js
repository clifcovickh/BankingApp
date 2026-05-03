const express = require('express');

const helmet = require('helmet');

const cors = require('cors');

const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./swagger');

const { Customer, Account, Transaction, DepositoType } = require('./models/index');

const sequelize = require('./config/database');

require('dotenv').config();

const routes = require('./routes/routes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Database Sync
sequelize
  .sync({ alter: true }) // 'alter' updates tables to match models
  .then(() => console.log('PostgreSQL Connected & Synced'))
  .catch((err) => console.error('Database Sync Error:', err));
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

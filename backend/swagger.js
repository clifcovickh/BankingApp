const swaggerJsdoc = require('swagger-jsdoc');

const packageJson = require('./package.json');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'Banking App API',

      version: packageJson.version || '1.0.0',

      description: 'API documentation for the Banking Saving System',
    },

    servers: [
      {
        url: 'http://localhost:5000/api',

        description: 'Local development server',
      },
    ],
  },

  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

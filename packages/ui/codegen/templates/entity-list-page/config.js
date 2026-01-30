module.exports = {
  outputPath: 'src',
  defaults: {
    hasAdd: true,
    hasEdit: true,
    hasDelete: true,
    hasView: true,
    hasFilters: true,
    hasSearch: true,
    routePrefix: '/admin',
    apiEndpoint: '/api',
    generateMocks: true
  },
  postGenerate: [
    // Removed pnpm lint:fix to prevent breaking existing code
  ]
};

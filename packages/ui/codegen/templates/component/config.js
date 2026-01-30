module.exports = {
  outputPath: 'src/components',
  defaults: {
    typescript: true,
    props: 'interface',
    styling: 'emotion'
  },
  postGenerate: [
    'pnpm lint:fix'
  ]
};

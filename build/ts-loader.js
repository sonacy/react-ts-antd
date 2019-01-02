const tsImportPluginFactory = require('ts-import-plugin')

const getCustomTransformers = () => ({
  before: [tsImportPluginFactory([
    {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
    },
  ])],
})

module.exports = getCustomTransformers

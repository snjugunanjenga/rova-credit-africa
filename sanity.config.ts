import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Rova Credit',
  projectId: 'dv03n90c',
  dataset: 'production',
  plugins: [structureTool(), visionTool(), codeInput()],
  schema: {
    types: schemaTypes,
  },
})

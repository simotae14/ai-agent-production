import { runLLM } from '../../src/llm'
import { generateImageToolDefinition } from '../../src/tools/generateImage'
import { runEval } from '../evalTools'
import { ToolCallMatch } from '../scorers'

// this function create the expected output
const createToolCallMessage = (toolName: string) => ({
  role: 'assistant',
  tool_calls: [
    {
      type: 'function',
      function: {
        name: toolName,
      },
    },
  ],
})

runEval('generateImage', {
  task: (input) =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: [generateImageToolDefinition],
    }),
  data: [
    {
      // this sentence needs to trigger generate image
      input: 'Generate an image of a sunset',
      // it shapes what runLLM returns
      expected: createToolCallMessage(generateImageToolDefinition.name),
    },
    {
      input: 'take a photo of the sunset',
      // it shapes what runLLM returns
      expected: createToolCallMessage(generateImageToolDefinition.name),
    },
  ],
  scorers: [ToolCallMatch],
})

import { runLLM } from '../../src/llm'
import { redditToolDefinition } from '../../src/tools/reddit'
import { dadJokeToolDefinition } from '../../src/tools/dadJoke'
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

const allTools = [
  redditToolDefinition,
  dadJokeToolDefinition,
  generateImageToolDefinition,
]

runEval('allTools', {
  task: (input) =>
    runLLM({
      messages: [{ role: 'user', content: input }],
      tools: allTools,
    }),
  data: [
    {
      // this sentence needs to trigger dad joke
      input: 'Tell me a funny dad joke',
      // it shapes what runLLM returns
      expected: createToolCallMessage(dadJokeToolDefinition.name),
    },
    {
      // this sentence needs to trigger generate image
      input: 'Take a photo of mars',
      // it shapes what runLLM returns
      expected: createToolCallMessage(generateImageToolDefinition.name),
    },
    {
      // this sentence needs to trigger reddit
      input: 'What is the most upvoted post on reddit',
      // it shapes what runLLM returns
      expected: createToolCallMessage(redditToolDefinition.name),
    },
  ],
  scorers: [ToolCallMatch],
})

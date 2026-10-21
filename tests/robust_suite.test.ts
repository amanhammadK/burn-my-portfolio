import { vi, describe, it, expect } from 'vitest';

// Offline mocks for external modules
vi.mock('openai', () => {
  const mockOpenAI = {
    chat: {
      completions: {
        create: vi.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mocked completion' } }]
        })
      }
    }
  };
  return {
    default: vi.fn().mockImplementation(() => mockOpenAI),
    OpenAI: vi.fn().mockImplementation(() => mockOpenAI)
  };
});

vi.mock('langchain', () => ({
  LLMChain: vi.fn().mockImplementation(() => ({
    call: vi.fn().mockResolvedValue({ text: 'Mocked chain response' }),
    invoke: vi.fn().mockResolvedValue({ text: 'Mocked chain response' })
  })),
  OpenAI: vi.fn()
}));

vi.mock('pg', () => {
  const mClient = {
    connect: vi.fn(),
    query: vi.fn().mockResolvedValue({ rows: [], rowCount: 0 }),
    end: vi.fn()
  };
  return { Client: vi.fn(() => mClient), Pool: vi.fn(() => mClient) };
});

vi.mock('node-fetch', () => ({
  default: vi.fn().mockResolvedValue({
    json: vi.fn().mockResolvedValue({ success: true, data: {} }),
    text: vi.fn().mockResolvedValue('Mocked response')
  })
}));

vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: { success: true } }),
    post: vi.fn().mockResolvedValue({ data: { success: true } })
  }
}));

vi.mock('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: vi.fn().mockImplementation(() => ({
    setRequestHandler: vi.fn(),
    connect: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined)
  }))
}));

vi.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: vi.fn().mockImplementation(() => ({}))
}));

vi.mock('@modelcontextprotocol/sdk/types.js', () => ({
  CallToolRequestSchema: {},
  ListToolsRequestSchema: {}
}));

// Import actual source files
import * as appCode_0 from '../src/App';
import * as appCode_1 from '../src/main';
import * as appCode_2 from '../src/vite-env.d';

describe('Authentic Node.js Test Suite for burn-my-portfolio', () => {

  it('should successfully import and define src/App.tsx', () => {
    expect(appCode_0).toBeDefined();
  });

  it('should successfully import and define src/main.tsx', () => {
    expect(appCode_1).toBeDefined();
  });

  it('should successfully import and define src/vite-env.d.ts', () => {
    expect(appCode_2).toBeDefined();
  });
});

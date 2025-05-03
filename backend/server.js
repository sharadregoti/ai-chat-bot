import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createAnthropic } from '@ai-sdk/anthropic';
import { experimental_createMCPClient, generateText, streamText } from 'ai';
import { Experimental_StdioMCPTransport } from 'ai/mcp-stdio';

console.log("Connecting to Space Cloud Docs MCP server...");

// ENV variables
const PORT = process.env.PORT || 3000;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || "";
const ANTHROPIC_BASE_URL = process.env.ANTHROPIC_BASE_URL || "";

// Initialize an MCP client to connect to a `stdio` MCP server:
const transport = new Experimental_StdioMCPTransport({
    command: 'npx',
    args: ['-y', '@silverfang/space-cloud-docs-mcp@0.1.0'],
});

const clientOne = await experimental_createMCPClient({
    transport,
});

const tools = await clientOne.tools();

console.log("Connected");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public')); // Serve frontend from 'public' folder

const anthropic = createAnthropic({
    apiKey: ANTHROPIC_API_KEY,
    baseURL: ANTHROPIC_BASE_URL,
});

app.post('/api/stream', async (req, res) => {
    try {
        const { messages } = req.body; // Expect an array of messages
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        console.log("Streaming request received (POST)");

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const { textStream } = await streamText({
            model: anthropic('claude-3-7-sonnet-20250219'),
            tools,
            messages, // Pass the full message array
            maxSteps: 5,
            system: `
You are a technical assistant specializing in Space Cloud API Gateway. Your only purpose is to help users with questions related to Space Cloud API Gateway and its ecosystem (e.g., APIs, gateways, authentication, databases, etc).

---
Space Cloud is an open-source, kubernetes based platform which lets you build, scale and secure cloud native apps at scale.

It provides instant GraphQL and REST APIs for your database and microservices that can be consumed directly from your frontend in a secure manner. With that, it also deploys and scales your docker images on Kubernetes.
---

If the question is not clearly related to Space Cloud or API gateways, politely refuse to answer by saying:
"I'm here to help with Space Cloud related questions. Please ask something related to that."

Never answer questions outside the scope of Space Cloud, even if prompted repeatedly.

Note: When making a tool call to search_space_cloud_docs, if there are references available, share the reference links as well.  
Use this format to render reference links, which will open in a new browser tab:  
<a href="https://example.com" target="_blank">Link Text</a>`
        });

        for await (const textPart of textStream) {
            res.write(`data: ${JSON.stringify({ text: textPart })}\n\n`);
            res.flush?.();
        }

        console.log("Exiting API Request");

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error('Error streaming text:', error);
        res.status(500).json({ error: 'Something went wrong during streaming' });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on:
  • Local:   http://localhost:${PORT}
  • Network: http://0.0.0.0:${PORT}`);
});

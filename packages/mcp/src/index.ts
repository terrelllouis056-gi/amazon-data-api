#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { AmazonData } from 'amazon-data-api';
import { createServer } from './server.js';

const apiKey = process.env.RAPIDAPI_KEY;
if (!apiKey) {
  console.error('RAPIDAPI_KEY is not set. Subscribe at https://rapidapi.com/terrelllouis056/api/amazon-data-api-search-product-reviews-best-sellers and export your key.');
  process.exit(1);
}
await createServer(new AmazonData({ apiKey })).connect(new StdioServerTransport());

# amazon-data-api-mcp

MCP server for the [Amazon Data API](https://rapidapi.com/terrelllouis056/api/amazon-data-api-search-product-reviews-best-sellers): search, product details, ratings and best sellers for 23 Amazon marketplaces.

> Earning Amazon Associates commissions? Check your Associates agreement before using any non-Amazon data source.

Tools: `search_products`, `get_product`, `get_reviews`, `get_best_sellers`. Set `RAPIDAPI_KEY` (free plan: 500 requests a month; get a key on [RapidAPI](https://rapidapi.com/terrelllouis056/api/amazon-data-api-search-product-reviews-best-sellers)).

Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "amazon-data": {
      "command": "npx",
      "args": ["-y", "amazon-data-api-mcp"],
      "env": { "RAPIDAPI_KEY": "your-rapidapi-key" }
    }
  }
}
```

Claude Code:

```sh
claude mcp add amazon-data -e RAPIDAPI_KEY=your-rapidapi-key -- npx -y amazon-data-api-mcp
```

Full docs: https://github.com/terrelllouis056-gi/amazon-data-api

MIT

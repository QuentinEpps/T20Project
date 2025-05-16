
### Project Requirements

I need to create a REST API application in Python using FastAPI.

The application needs to pull data from two Cosmos DB collections in the "t20project" database.

This is the sample data from the "holdings" collection:

```json
{
    "id": "eth-identifier",
    "ticker_symbol": "ETH",
    "asset": "Ethereum (ETH)",
    "price": 1000,
    "change": -1.2,
    "balance": 5,
    "totalValue": 10000
}
```

This is the sample data from the "chartdata" collection:

```json
{
    "ticker_symbol": "BTC",
    "label": "Bitcoin",
    "data": [
        1100,
        1200,
        1300,
        1250,
        1400,
        1500,
        1450
    ],
    "id": "btc-identifier"
}

```

The project needs to have two REST endpoints that supports the HTTP GET request method for the holdings and chartdata collections:

- /api/holdings
- /api/chartdata 

Create a FastAPI rest application in Python within a file called "fastapi_backend.py" that has these two REST endpoints that can pull the data from these two Cosmos DB collection


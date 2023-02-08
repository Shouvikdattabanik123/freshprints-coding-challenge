# Apparel Stock Management

The code for the API server is written in Node.js, TypeScript and is based on the Express framework. The API server is responsible for managing the apparels data and handling the API requests to update, retrieve, and check the apparels information. The API server uses an external file, apparels.json, to store the apparels data.

The API server provides four different API endpoints to perform different operations on the apparels data:

- Update the stock and price of a single apparel using PATCH /apparel API endpoint.
- Update the stock and price of multiple apparels using PUT /apparels API endpoint.
- Check if the customer order can be fulfilled using POST /order API endpoint.
- Get the minimum cost to fulfill the customer order using POST /order/cost API endpoint.

The API server uses the following technologies:

- Express: A fast, flexible, and minimalist web framework for Node.js.
- TypeScript: A statically typed language that builds on JavaScript.
- JSON: A lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate.
- Mocha: A JavaScript test framework that runs on Node.js.
- Chai: An assertion library for Node.js and the browser.
- Chai-HTTP: A Chai plugin that provides a set of HTTP-specific assertions.

## Steps to Set up the Server:

- Install Node.js and npm on your computer.
- Clone the repository containing the source code from GitHub.
- Open a terminal or command prompt and navigate to the project directory.
- Run ```npm install``` to install the required packages.
- Run ```npm start``` to start the API server.

## API definition and how to test them
The API has 4 endpoints:

1. PATCH /apparel: 
Update the stock quality and price of one apparel code and size.

- Request Body:
```
{
    "code": "A001",
    "size": "M",
    "stock": 10,
    "price": 20
}
```
Response:

- 200 OK: If the apparel is successfully updated.
- 400 Bad Request: If the request body is invalid or if the apparel with the given code and size is not found.
- 404 Not Found: If the apparel with the given code and size is not found.
- 500 Internal Server Error: If an error occurs while updating the apparel.

2. PUT /apparels: 
Update the stock quality and price of multiple apparel codes and sizes.

Request Body:
```
[
    {
        "code": "A001",
        "size": "M",
        "stock": 20,
        "price": 20
    },
    {
        "code": "A002",
        "size": "L",
        "stock": 10,
        "price": 19
    }
]
```
Response:

- 200 OK: If all the apparels are successfully updated.
- 400 Bad Request: If any of the request bodies is invalid or if any apparel with the given code and size is not found.
- 404 Not Found: If any of the apparels with the given code and size is not found.
- 500 Internal Server Error: If an error occurs while updating the apparels.
3. POST /order: 
Check if the customer order can be fulfilled.

Request Body:
```
[
    {
        "code": "A001",
        "size": "M",
        "quantity": 15
    },
    {
        "code": "A002",
        "size": "L",
        "quantity": 9
    }
]
```
Response:

- 200 OK: If all the items in the order can be fulfilled.
- 400 Bad Request: If any of the request bodies is invalid or if any apparel with the given code and size is not found.
- 404 Not Found: If any of the apparels with the given code and size is not found.
- 500 Internal Server Error: If an error occurs while checking the order.

4. POST /order/cost: Get the lowest cost to fulfill the customer order.

Request Body:
```
[
    {
        "code": "A001",
        "size": "M",
        "quantity": 15
    },
    {
        "code": "A002",
        "size": "L",
        "quantity": 9
    }
]
```
Response:

- 200 OK: If all the items in the order can be fulfilled and returns the total cost.
- 400 Bad Request: If any of the request bodies is invalid, if the quantity is less than 0, or if the stock of the apparel is less than the requested quantity.
- 404 Not Found: If any of the apparels with the given code and size is not found.
- 500 Internal Server Error: If an error occurs while retrieving the total cost.
# gatsby-source-tribe-events

Gatsby source plugin to add Petfinder nodes created from Petfinder endpoints:

- Animals (/animals)
  - Get Animals
  - Get Animal
- Animal Types (/types)
  - Get A Single Animal Type
  - Get Animal Breeds (/types/{type}/breeds)
- Organization (/organizations)

## Dependencies

axios

## Installation

`npm install --save gatsby-source-petfinder`

## Examples of usage

In your `gatsby-config.js`:

```js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-petfinder",
      options: {
        // baseUrl should include the protocol (https or http)
        baseUrl: "https://mysite.tld",

        // maxEvents is optional, default: 10, max: 50
        maxEvents: 10,
      },
    },
  ],
};
```

## How to query for data

```graphql
allTribeEvents {
    edges {
      node {
        id
        title
        slug
        all_day
        start_date
        end_date
        featured
        venue {
          venue
          url
          slug
          address
          city
          state
          zip
        }
        description
      }
    }
  }
```

## ToDo

- Create relationships between nodes
- Create nodes for all events (more than 50)

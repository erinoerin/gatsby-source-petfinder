# gatsby-source-petfinder

Gatsby source plugin to add Petfinder nodes created from Petfinder endpoint Animals.

This is an opinionated source plugin in that it expects an organization to be provided and only returns animals associated with the organization.

Future updates could include showing all organizations in a geographic area, or all pets in a geographic area.

If you have ideas or requests for enhancements to this plugin, please [create an issue in github](https://github.com/erinoerin/gatsby-source-petfinder/issues).

See this plugin in action at the [Gastby Petfinder Demo site](https://gatsby-petfinder-demo.netlify.app/).

## Dependencies

axios

## Installation

npm install --save gatsby-source-petfinder

## Get a petfinder API key

Go to [Petfinder for Developers](https://www.petfinder.com/developers/) to request an API key. You will need to pass your API key and secret to the plugin.

## Examples of usage

In your `gatsby-config.js`:

```js
module.exports = {
  plugins: [
    {
      resolve: "gatsby-source-petfinder",
      options: {
        apiKey: "YOURAPIKEY",
        apiSecret: "YOURAPISECRET",
        orgID: "AZ631",
      },
    },
  ],
};
```

## How to query for data

```graphql
allPetfinderAnimals {
    edges {
      node {
        id
        url
        name
        type
        breeds {
          mixed
          primary
          secondary
          unknown
        }
        gender
        age
        coat
        size
        species
        status
        photos {
          full
          large
          medium
          small
        }
        primary_photo_cropped {
          full
          large
          medium
          small
        }
        tags
        status_changed_at
        contact {
          email
          phone
        }
        attributes {
          house_trained
          shots_current
          spayed_neutered
          special_needs
        }
      }
    }
  }
```

## In memory of Lizzie :dog:

February 6, 2006 - June 26, 2020. She was my little fluffy sidekick and a good dog.

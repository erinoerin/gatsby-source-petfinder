const axios = require("axios");

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  options
) => {
  /* Setup the GraphQL Schema for Pets */
  const { createTypes } = actions;
  const typeDefs = `
    type petBreed {
      primary: String
      secondary: String
      mixed: Boolean 
      unknown: Boolean
    }

    type petColors {
      primary: String
      secondary: String
      tertiary: String
    }

    type petPhotos {
      small: String
      medium: String
      large: String
      full: String
    }

    type petVideos {
      embed: String
    }

    type petAttributes {
      spayed_neutered: Boolean
      house_trained: Boolean
      declawed: Boolean
      special_needs: Boolean
      shots_current: Boolean
    }

    type petEnvironment {
      children: Boolean
      dogs: Boolean
      cats: Boolean
    }
    type petAddress{
      address1: String
      address2: String
      city: String
      state: String
      postcode: String
      country: String
    }

    type petContact {
      email: String
      phone: String
      address: petAddress
    }

    type PetfinderAnimals implements Node{
      id: Integer
      organization_id: String
      url: String
      type: String
      species: String
      breeds: petBreed
      colors: petColors
      age: String
      gender: String
      size: String
      coat: String
      name: String
      description: String
      primary_photo_cropped: petPhotos
      photos: [petPhotos]
      videos: [petVideos]
      status: String
      attributes: petAttributes
      environment: petEnvironment
      tags: [String]
      contact: petContact
      published_at: String
      distance: String
    }
  `;
  createTypes(typeDefs);

  const { apiKey, apiSecret, orgID } = options;

  const authKey = await getAuthKey(apiKey, apiSecret);

  const resultAnimals = await pfGetResults("animals", orgID, authKey);
  pfCreateNode(resultAnimals, "PetfinderAnimals");

  async function getAuthKey(apiKey, apiSecret) {
    result = await axios({
      method: "post",
      url: "https://api.petfinder.com/v2/oauth2/token/",
      data: {
        grant_type: "client_credentials",
        client_id: apiKey,
        client_secret: apiSecret,
      },
    }).catch((error) => {
      console.error(error.message);
    });
    return result.data.access_token;
  }

  async function pfGetResults(endPoint, orgID, authKey) {
    let varPage = 0;
    let varAnimals = [];

    do {
      varPage++;
      result = await axios({
        method: "GET",
        url: `https://api.petfinder.com/v2/${endPoint}`,
        headers: { Authorization: `Bearer ${authKey}` },
        params: {
          organization: orgID,
          page: varPage,
          limit: 100,
        },
      }).catch((error) => {
        console.error(error.message);
      });
      varAnimals = varAnimals.concat(result.data.animals);
    } while (
      result.data.pagination.current_page < result.data.pagination.total_pages
    );
    console.log(`Number of Array Elements: ${varAnimals.length}`);
    return varAnimals;
  }

  function pfCreateNode(result, pfType) {
    result.forEach((r) => {
      const node = {
        ...r,
        id: createNodeId(`${pfType}-${r.id}`),
        internal: {
          type: pfType,
          contentDigest: createContentDigest(r),
        },
      };
      actions.createNode(node);
    });
  }
};

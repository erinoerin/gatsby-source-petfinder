const axios = require("axios");

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  options
) => {
  const { apiKey, apiSecret, orgID } = options;

  const authKey = await getAuthKey(apiKey, apiSecret);

  const resultAnimals = await pfGetResults("animals", orgID, authKey);

  pfCreateNode(resultAnimals.animals, "PetfinderAnimals");

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
    result = await axios({
      method: "GET",
      url: `https://api.petfinder.com/v2/${endPoint}`,
      headers: { Authorization: `Bearer ${authKey}` },
      params: {
        organization: orgID,
      },
    }).catch((error) => {
      console.error(error.message);
    });
    return result.data;
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

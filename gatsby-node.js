const axios = require("axios");

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  options
) => {
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

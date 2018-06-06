const { get } = require("./gocd-request");

const convertToCamelCase = property => `${property[0].toLowerCase()}${property
    .substring(1)
    .replace(/[_]\w/g, m => m[1].toUpperCase())}`;

const convertPropertiesToCamelCase = agent => Object.keys(agent).reduce((mappedAgent, property) => {
    mappedAgent[convertToCamelCase(property)] = agent[property];

    return mappedAgent;
}, {});

module.exports = {
    getAllAgents: async () => {
        const data = await get({
            path: "agents/",
        });

        return JSON.parse(data)._embedded.agents // eslint-disable-line no-underscore-dangle
            .map(convertPropertiesToCamelCase);
    },
};

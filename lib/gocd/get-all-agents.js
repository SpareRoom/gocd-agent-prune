const { get } = require("./gocd-request");

module.exports = {
    getAllAgents: async () => {
        const data = await get({
            path: "agents/",
            accept: "application/vnd.go.cd.v4+json",
        });

        return JSON.parse(data)._embedded.agents; // eslint-disable-line no-underscore-dangle
    },
};

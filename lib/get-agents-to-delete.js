const { getAllAgents } = require("./gocd/get-all-agents");

module.exports = {
    getAgentsToDelete: async () => {
        const agents = await getAllAgents();

        return agents;
    },
};

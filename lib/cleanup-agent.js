const { disableAgent } = require("./gocd/disable-agent");
const { deleteAgent } = require("./gocd/delete-agent");

module.exports = {
    cleanupAgent: async ({ uuid, agentConfigState }) => {
        if (agentConfigState !== "Disabled") {
            await disableAgent(uuid);
        }

        return deleteAgent(uuid);
    },
};

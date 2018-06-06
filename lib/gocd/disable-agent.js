const { patch } = require("./gocd-request");

module.exports = {
    disableAgent: async (uuid) => {
        console.log(`Disabling: ${uuid}`);

        return patch({
            path: `agents/${uuid}`,
            body: { agent_config_state: "Disabled" },
        });
    },
};

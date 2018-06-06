const { del } = require("./gocd-request");

module.exports = {
    deleteAgent: async (uuid) => {
        console.log(`Deleting: ${uuid}`);

        return del({
            path: `agents/${uuid}`,
        });
    },
};

const { getAgentsToDelete } = require("./get-agents-to-delete");
const { cleanupAgent } = require("./cleanup-agent");

const { getConfig } = require("./config");

module.exports = () => {
    let nextScheduledTaskTimeout;
    const { cleanUpIntervalMs } = getConfig();

    const doCleanUp = async () => {
        const allAgentsToDelete = await getAgentsToDelete();

        console.log(`${allAgentsToDelete.length} agent${allAgentsToDelete.length === 1 ? "" : "s"} require deleting`);

        await Promise.all(allAgentsToDelete.map(cleanupAgent));

        nextScheduledTaskTimeout = setTimeout(doCleanUp, cleanUpIntervalMs);
    };

    return {
        start: () => doCleanUp(),
        stop: () => clearTimeout(nextScheduledTaskTimeout),
    };
};

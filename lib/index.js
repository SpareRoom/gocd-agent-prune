const { getAgentsToDelete } = require("./get-agents-to-delete");
const { cleanupAgent } = require("./cleanup-agent");

const { getConfig } = require("./config");

module.exports = () => {
    let nextScheduledTaskTimeout;
    const { cleanUpIntervalMs } = getConfig();

    const doCleanUp = async () => {
        try {
            const allAgentsToDelete = await getAgentsToDelete();

            console.log(`${allAgentsToDelete.length} agent${allAgentsToDelete.length === 1 ? "" : "s"} require cleanup`);

            await Promise.all(allAgentsToDelete.map(cleanupAgent));

            nextScheduledTaskTimeout = setTimeout(doCleanUp, cleanUpIntervalMs);
        } catch (e) {
            console.log(`Error cleaning up go agents: ${e.message}`);
            nextScheduledTaskTimeout = setTimeout(doCleanUp, cleanUpIntervalMs);
        }
    };

    return {
        start: () => doCleanUp(),
        stop: () => clearTimeout(nextScheduledTaskTimeout),
    };
};

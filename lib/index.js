const { getAgentsToDelete } = async () => {};
const disableAndDeleteAgent = async () => {};

module.exports = () => {
    let nextScheduledTaskTimeout;

    const doCleanUp = async () => {
        const allAgentsToDelete = await getAgentsToDelete();

        await Promise.all(allAgentsToDelete.map(disableAndDeleteAgent));

        nextScheduledTaskTimeout = setTimeout(doCleanUp, 30000);
    };

    return {
        start: () => doCleanUp(),
        stop: () => clearTimeout(nextScheduledTaskTimeout),
    };
};

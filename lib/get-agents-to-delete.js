const { inRange } = require("range_check");

const { getAllAgents } = require("./gocd/get-all-agents");
const { getConfig } = require("./config");

const statusesToDelete = ["LostContact", "Missing"];

const filterAgentState = ({ agentState }) => statusesToDelete.includes(agentState);
const filterAgentIpAddress = (managedIpRanges, { ipAddress }) => {
    if (!managedIpRanges.length) {
        return true;
    }

    const remainingIpRanges = [...managedIpRanges];
    let currentIpRange;

    while (remainingIpRanges.length) {
        currentIpRange = remainingIpRanges.shift();

        if (inRange(ipAddress, currentIpRange)) {
            return true;
        }
    }

    return false;
};

module.exports = {
    getAgentsToDelete: async () => {
        const agents = await getAllAgents();
        const { managedIpRanges } = getConfig();

        return agents.filter(agent =>
            filterAgentState(agent) && filterAgentIpAddress(managedIpRanges, agent));
    },
};

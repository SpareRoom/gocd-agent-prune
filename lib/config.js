const appName = "gocdprune";

const getManagedIpRanges = () => {
    const envVariable = process.env[`${appName}__managedipranges`];

    if (!envVariable) {
        return [];
    }

    return envVariable.split(",");
};

const getCleanUpIntervalMs = () => (process.env[`${appName}__cleanUpIntervalMs`]
    ? parseInt(process.env[`${appName}__cleanUpIntervalMs`], 10)
    : 30000);

const config = {
    host: process.env[`${appName}__host`],
    username: process.env[`${appName}__username`],
    password: process.env[`${appName}__password`],
    managedIpRanges: getManagedIpRanges(),
    cleanUpIntervalMs: getCleanUpIntervalMs(),
};

module.exports = {
    getConfig: () => config,
};

const request = require("request");
const { getConfig } = require("../config");

const makeRequest = async options =>
    new Promise((resolve, reject) =>
        request(options, ((err, response, data) => {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        })));

const buildAuthHeader = (config) => {
    const { username, password } = config;
    const usernameAndPassword = `${username}:${password}`;

    return `Basic ${Buffer.from(usernameAndPassword, "utf-8").toString("base64")}`;
};

module.exports = {
    get: async ({ path, accept }) => {
        const config = getConfig();

        const { host } = config;

        const requestOptions = {
            url: `${host}/go/api/${path}`,
            headers: {
                Accept: accept,
                Authorization: buildAuthHeader(config),
            },
        };

        return makeRequest(requestOptions);
    },
};

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

const buildFullApiUrl = ({ host }, path) => `${host}/go/api/${path}`;

module.exports = {
    get: async ({ path }) => {
        const config = getConfig();

        const requestOptions = {
            url: buildFullApiUrl(config, path),
            headers: {
                Accept: "application/vnd.go.cd.v4+json",
                Authorization: buildAuthHeader(config),
            },
        };

        return makeRequest(requestOptions);
    },
    patch: async ({ path, body }) => {
        const config = getConfig();

        const requestOptions = {
            url: buildFullApiUrl(config, path),
            method: "PATCH",
            headers: {
                Accept: "application/vnd.go.cd.v4+json",
                Authorization: buildAuthHeader(config),
            },
            json: body,
        };

        return makeRequest(requestOptions);
    },
    del: async ({ path }) => {
        const config = getConfig();

        const requestOptions = {
            url: buildFullApiUrl(config, path),
            method: "DELETE",
            headers: {
                Accept: "application/vnd.go.cd.v4+json",
                Authorization: buildAuthHeader(config),
            },
        };

        return makeRequest(requestOptions);
    },
};

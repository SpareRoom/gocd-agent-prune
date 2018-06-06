const nock = require("nock");

const { getAgentsToDelete } = require("../lib/get-agents-to-delete");

let mockManagedIpRanges = [];

const setManagedIpRange = (range) => {
    mockManagedIpRanges = range;
};

jest.mock("../lib/config", () => ({
    getConfig: () => ({
        host: "http://local.gocd.com",
        username: "username",
        password: "password",
        managedIpRanges: mockManagedIpRanges,
    }),
}));

describe("getAgentsToDelete", () => {
    beforeEach(() => setManagedIpRange([]));

    it("returns agents which have Missing and LostContact only", async () => {
        nock("http://local.gocd.com")
            .get("/go/api/agents/")
            .reply(200, JSON.stringify({
                _embedded: {
                    agents: [
                        {
                            uuid: "9d34c121-a728-4492-83ed-1b8d4b8e50ff",
                            ip_address: "172.18.0.8",
                            agent_state: "Missing",
                        },
                        {
                            uuid: "c2428e45-2062-42ef-b99c-b75a9666c451",
                            ip_address: "172.18.0.4",
                            agent_state: "Idle",
                        },
                        {

                            uuid: "d76dfc5b-01fe-4919-bc72-e1950cb99cd0",
                            ip_address: "172.18.0.9",
                            agent_state: "LostContact",
                        },
                    ],
                },
            }));

        expect(await getAgentsToDelete()).toEqual([
            {
                uuid: "9d34c121-a728-4492-83ed-1b8d4b8e50ff",
                ipAddress: "172.18.0.8",
                agentState: "Missing",
            },
            {
                uuid: "d76dfc5b-01fe-4919-bc72-e1950cb99cd0",
                ipAddress: "172.18.0.9",
                agentState: "LostContact",
            },
        ]);
    });

    it("returns agents which have are withing the specified IP ranges only", async () => {
        setManagedIpRange(["172.0.0.0/8"]);

        nock("http://local.gocd.com")
            .get("/go/api/agents/")
            .reply(200, JSON.stringify({
                _embedded: {
                    agents: [
                        {
                            uuid: "9d34c121-a728-4492-83ed-1b8d4b8e50ff",
                            ip_address: "172.17.0.8",
                            agent_state: "Missing",
                        },
                        {
                            uuid: "c2428e45-2062-42ef-b99c-b75a9666c451",
                            ip_address: "10.0.0.1",
                            agent_state: "LostContact",
                        },
                        {

                            uuid: "d76dfc5b-01fe-4919-bc72-e1950cb99cd0",
                            ip_address: "172.18.0.9",
                            agent_state: "LostContact",
                        },
                    ],
                },
            }));

        expect(await getAgentsToDelete()).toEqual([
            {
                uuid: "9d34c121-a728-4492-83ed-1b8d4b8e50ff",
                ipAddress: "172.17.0.8",
                agentState: "Missing",
            },
            {
                uuid: "d76dfc5b-01fe-4919-bc72-e1950cb99cd0",
                ipAddress: "172.18.0.9",
                agentState: "LostContact",
            },
        ]);
    });
});

const nock = require("nock");

const { getAgentsToDelete } = require("../lib/get-agents-to-delete");

jest.mock("../lib/config", () => ({
    getConfig: () => ({
        host: "http://local.gocd.com",
        username: "username",
        password: "password",
    }),
}));

describe("getAgentsToDelete", () => {
    it("returns agents which have LostContact only", async () => {
        nock("http://local.gocd.com")
            .get("/go/api/agents/")
            .reply(200, JSON.stringify({
                _embedded: {
                    agents: [{ ip_address: "192.168.0.1" }],
                },
            }));

        const agentsToDelete = await getAgentsToDelete();

        expect(agentsToDelete).toEqual([
            { ip_address: "192.168.0.1" },
        ]);
    });
});

// Created by J. Eric Hartzog on 9/19/17

const GalaxyPage = {
    connections: {
        get: function getConnections() {
            const number = $("div.cardinal-name:contains('Connections')").siblings().text();
            return Number.parseInt(number, 10);
        },
    },
};

export default GalaxyPage;

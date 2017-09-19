// Created by J. Eric Hartzog on 7/19/17

// Returns 1 for scaling up, -1 for scaling down, 0 for do nothing
const scalingLogic = ({ connections, cpu, memory, containers }) => {
    if (containers < 2) {
        console.log('Less than two containers, scaling up');
        return 1;
    }

    if (connections < 100 && containers > 2) {
        console.log('Low connections, high containers, scaling down');
        return -1;
    }

    if (connections > 100 && containers < 3) {
        console.log('High connections, low containers, scaling up');
        return 1;
    }

    console.log('No scaling action taken');
    return 0;
};

module.exports = scalingLogic;
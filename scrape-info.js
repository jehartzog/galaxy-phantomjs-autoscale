// Created by J. Eric Hartzog on 7/19/17

const scrapeInfo = async browser => {
    const sections = await browser.elements('div.section-cardinal.quarter');

    const getNumberForSection = async section => {
        const sectionId = sections.value[section].ELEMENT;
        const numberElm = await browser.elementIdElement(sectionId, '.cardinal-numeral');
        const numberText = await browser.elementIdText(numberElm.value.ELEMENT);
        return Number.parseFloat(numberText.value);
    }

    const getCurrentNumberInstances = async section => {
        const sectionId = sections.value[3].ELEMENT;
        const numberElm = await browser.elementIdElement(sectionId, 'input');
        const numberText = await browser.elementIdAttribute(numberElm.value.ELEMENT, 'value');
        return Number.parseInt(numberText.value, 10);
    }

    return {
        connections: await getNumberForSection(0),
        cpu: await getNumberForSection(1),
        memory: await getNumberForSection(2),
        containers: await getCurrentNumberInstances(),
    }
};

module.exports = scrapeInfo;
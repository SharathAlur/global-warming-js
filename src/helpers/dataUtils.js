export const ranges = [0, 50000000, 500000000, 5000000000, 50000000000, 10000000000, 25000000000, 40000000000];
/**
 * Converts the numbers to readable string format
 * 
 * @param {number} value Emission Value
 * @returns {string} Value in readable string format
 */
export const convertToText = (value) => {
    if (value === null || isNaN(value)) {
        return 'No Data';
    }
    let temp = value/1000000000;
    if (temp > 1) {
        return `${+temp.toFixed(2)} billion t`;
    }
    temp = value/1000000;
    if (temp > 1) {
        return `${+temp.toFixed(2)} million t`;
    }
    temp = value/1000;
    if (temp > 1) {
        return `${+temp.toFixed(2)} thousand t`;
    }
    return `${+temp.toFixed(2)} t`;
}

/**
 * Identifies the emission level in the range
 * 
 * @param {number} value emission value
 * 
 * @returns {number} emission level
 */
export const getLevel = (value) => {
    if (value < ranges[1]) {
        return 1;
    } else if (value < ranges[2]) {
        return 2;
    } else if (value < ranges[3]) {
        return 3;
    } else if (value < ranges[4]) {
        return 4;
    } else if (value < ranges[5]) {
        return 5;
    } else if (value < ranges[6]) {
        return 6;
    } 
    return 7;
}

/**
 * Wrapper method to find the emission level for a country
 *
 * @param {Array} filteredData Emission data loaded on the map
 * 
 * @returns {Function} function to find emission level for the country hovered on
 */
export const getEmissionLevel = (filteredData) => ((d) => {
        const countryEmission = filteredData.find(({ Entity }) => d.properties.name.includes(Entity));
        return countryEmission ? getLevel(countryEmission['Annual CO2']) : 0;
    })


/**
 * Wrapper method to find the emission value for a country
 *
 * @param {Array} filteredData Emission data loaded on the map
 * 
 * @returns {Function} function to find emission value for the country hovered on
 */
export const getEmissionValue = (filteredData) => ((d) => {
        const countryEmission = filteredData.find(({ Entity }) => d.properties.name.includes(Entity));
        return countryEmission? countryEmission['Annual CO2'] : undefined;
    })
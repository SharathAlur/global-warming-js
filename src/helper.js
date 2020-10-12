export const convertToText = (value) => {
    if (!value) {
        return 'No Data';
    }
    let temp = value/1000000000;
    if (temp > 1) {
        return `${temp.toFixed(2)} billion tonnes`;
    }
    temp = value/1000000;
    if (temp > 1) {
        return `${temp.toFixed(2)} million tonnes`;
    }
    temp = value/1000;
    if (temp > 1) {
        return `${temp.toFixed(2)} thousand tonnes`;
    }
    return `${temp.toFixed(2)} tonnes`;
}


export const getEmissionLevel = (filteredData) => {
    return ((d) => {
        const countryEmission = filteredData.find(data => d.properties.name === data.Entity);
        let emissionStatus;
        if (!countryEmission) {
            emissionStatus = 0;
        } else if (countryEmission['Annual CO2'] < 50000000) {
            emissionStatus = 1;
        } else if (countryEmission['Annual CO2'] < 500000000) {
            emissionStatus = 2;
        } else if (countryEmission['Annual CO2'] < 5000000000) {
            emissionStatus = 3;
        } else if (countryEmission['Annual CO2'] < 50000000000) {
            emissionStatus = 4;
        } else if (countryEmission['Annual CO2'] < 10000000000) {
            emissionStatus = 5;
        } else if (countryEmission['Annual CO2'] < 25000000000) {
            emissionStatus = 6;
        } else if (countryEmission['Annual CO2'] < 40000000000) {
            emissionStatus = 7;
        }
        return emissionStatus;
    })
}

export const getEmissionValue = (filteredData) => {
    return ((d) => {
        const countryEmission = filteredData.find(data => d.properties.name === data.Entity);
        return countryEmission? countryEmission['Annual CO2'] : undefined;
    })
}
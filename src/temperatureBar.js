import styles from './styles/styles'

export default class TemperatureBar {
    constructor(svg, selectLevelCallback) {
        this.selectLevelCallback = selectLevelCallback;
        
        svg.select('.temperatureBar')
        .append('g')
        .classed(styles.temperatureBar, true);
    }
}
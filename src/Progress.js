import styles from "./styles/styles";

const playVector = "M2.067,0.043C2.21-0.028,2.372-0.008,2.493,0.085l13.312,8.503c0.094,0.078,0.154,0.191,0.154,0.313    c0,0.12-0.061,0.237-0.154,0.314L2.492,17.717c-0.07,0.057-0.162,0.087-0.25,0.087l-0.176-0.04    c-0.136-0.065-0.222-0.207-0.222-0.361V0.402C1.844,0.25,1.93,0.107,2.067,0.043z";
const pauseVector1 = "M13.987,0c-2.762,0-5,2.239-5,5v35.975c0,2.763,2.238,5,5,5s5-2.238,5-5V5C18.987,2.238,16.75,0,13.987,0z";
const pauseVector2 = "M31.987,0c-2.762,0-5,2.239-5,5v35.975c0,2.762,2.238,5,5,5s5-2.238,5-5V5C36.987,2.239,34.749,0,31.987,0z";
const initiate = (config, setYearCallBack) => {
    config.yearCounter = 1751;
    config.totalYears = 2018-1752;
    config.timer = null;
    config.setYearCallBack = setYearCallBack;
    config.playing = false;
}

/**
 * Adds progress bar
 */
export default class Progress {
    constructor(svg, setYearCallBack) {
        initiate(this, setYearCallBack);

        this.runTimer = this.runTimer.bind(this);
        this.draw = this.draw.bind(this);
        this.tick = this.tick.bind(this);
        this.setPlaying = this.setPlaying.bind(this);
        this.playPauseBtnClick = this.playPauseBtnClick.bind(this);

        this.draw(svg);
    }

    /**
     * Handler to Play or Pause the progress
     */
    playPauseBtnClick() {
        if (this.yearCounter > 2017) {
            this.yearCounter = 1751;
        }
        if (this.playing) {
            clearInterval(this.timer);
            this.setPlaying(false);
        } else {
            this.runTimer();
            this.setPlaying(true);
        }
    }

    /**
     * Draw the progress bar with play/pause button
     * 
     * @param {Node} svg The content to be drawn in.
     */
    draw(svg) {
        this.svg = svg.append('div').classed(styles.progressDiv, true);

        const playPauseBtn = this.svg.append('g').on('click', this.playPauseBtnClick);

        this.svg.append('text').text('1751').style('margin-right', '5px').style('color', 'gray');

        this.playButton = playPauseBtn
            .append('svg')
            .classed(styles.progressButton, true);
        this.pauseButton = playPauseBtn
            .append('svg')
            .classed(styles.progressButton, true)
            .classed(styles.hideIcon, !this.playing)
            .attr('viewBox', '0,0,65,65');

        this.playButton.append('path').attr('d', playVector);

        this.pauseButton.append('path').attr('d', pauseVector1);
        this.pauseButton.append('path').attr('d', pauseVector2);

        this.progressBar = this.svg
            .append('progress')
            .classed(styles.progressBar, true)
            .attr('max',this.totalYears)
            .attr('value', 0);

        this.svg.append('text').text('2017').style('margin-left', '5px').style('color', 'gray');
    }

    /**
     * Start and run timer
     */
    runTimer() {
        this.timer = setInterval(this.tick, 100);
        this.setPlaying(true);
    }
    
    /**
     * Sets playing status
     * 
     * @param {boolean} isPlaying If the timer is running or not
     */
    setPlaying(isPlaying) {
        this.playing = isPlaying;
        this.playButton.classed(styles.hideIcon, this.playing);
        this.pauseButton.classed(styles.hideIcon, !this.playing);
    }

    /**
     * Perform every tick of the timer
     */
    tick() {
        if(this.yearCounter < 2018) {
            this.setYearCallBack(this.yearCounter);
            this.progressBar.transition().attr('value', this.yearCounter-1750);
            this.yearCounter++; 
        }
        else{
            clearInterval(this.timer);
            this.setPlaying(false);
        }
    }
}
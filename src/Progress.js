const initiate = (config, setYearCallBack) => {
    config.yearCounter = 1751;
    config.totalYears = 2018-1752;
    config.timer = null;
    config.setYearCallBack = setYearCallBack;
}

export default class Progress {
    constructor(svg, setYearCallBack) {
        initiate(this, setYearCallBack);
        this.runTimer = this.runTimer.bind(this);
        this.tick = this.tick.bind(this);
        this.svg = svg.append('div').style('margin', '50px');
        this.svg.append('button').style('width', '30px').style('height', '20px').style('margin-right', '10px');
        this.progressBar = this.svg.append('progress').style('width', '800px').attr('max',this.totalYears).attr('value', 0);
        this.runTimer();
    }

    runTimer() {
        // Is the main timer function, calls `tick` every 1000 milliseconds
        this.timer = setInterval(this.tick, 100);
        // disable(unpauseButton); enable(pauseButton); // Toggles buttons
    }

    tick() {
        if(this.yearCounter < 2018) {
            this.setYearCallBack(this.yearCounter);
            this.progressBar.transition().attr('value', this.yearCounter-1750);
            this.yearCounter++; 
        }
        else{
            clearInterval(this.timer);
          // The timer has reached zero. Let the user start again. 
        //   enable(minutesInput); enable(startButton);
        //   disable(pauseButton); disable(unpauseButton);
        }
      }
}
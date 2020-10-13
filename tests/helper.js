import * as d3 from "d3";

export const fetchElementByClass = (id, cls) => id.querySelector(`.${cls}`);

export const fetchAllElementsByClass = (id, cls) =>
    id.querySelectorAll(`.${cls}`);

export const triggerEvent = (
    element,
    eventName,
    cb,
    delayDuration = 500
) => {
    try {
        const event = document.createEvent("Event");
        event.initEvent(eventName, true, true);
        element.dispatchEvent(event);
        if (cb) {
            delay(cb, delayDuration);
        }
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Error caught within event trigger", e);
    }
};

export const delay = (fn, time = TRANSITION_DELAY) => {
    flushAllD3Transitions();
    return d3.timeout(fn, time);
};

const flushAllD3Transitions = () => {
    const now = performance.now;
    performance.now = function () {
        return Infinity;
    };
    d3.timerFlush();
    performance.now = now;
};
import * as moment from "moment";
import * as React from "react";
import {Event, Task} from "../models";

interface NotifierProps {
    tasks: Array<Task>,
    events: Array<Event>,
}

interface NotifierState {
    enabled: boolean,
    lastNotificationTime: number,
}

const LOOP_FREQ = 60; // 1 minute
const FORCED_INTERVAL = 300; // We will at most send 1 notification every (this) many seconds
const LAG_THRESHOLD = 900; // After this many seconds, we will 100% chance send a notification

// Typescript doesn't know about the Notification API.
declare let Notification: any;

export class NotifierComponent extends React.Component<NotifierProps, NotifierState> {

    constructor(props) {
        super(props);
        this.state = {
            enabled: false,
            // We don't set this to 0 so that we don't immediately spam notifications on startup.
            // This is also needed post-redirect, so that we don't keep spamming on the way to
            // the user fixing the issue.
            lastNotificationTime: moment().unix() - FORCED_INTERVAL,
        }
    }

    loopId = 0;

    componentDidMount() {
        this.requestNotificationPermission();
        this.beginLoop();
    }

    componentWillUnmount() {
        // Kill our event loop
        if (this.loopId) {
            clearInterval(this.loopId);
        }
    }

    requestNotificationPermission() {
        Notification.requestPermission().then((result) => {
            if (result == "granted") {
                // mark notifications as enabled
                this.state.enabled = true;
                this.setState(this.state)
            }
        });
    }

    recordSendingNotification() {
        this.state.lastNotificationTime = moment().unix();
        this.setState(this.state)
    }

    spawnNotification(body, onClick) {
        let n = new Notification("Starter", {body: body});
        // Automatically close the notification after 5 seconds.
        n.onclick = onClick;
        setTimeout(n.close.bind(n), 5000)
    }

    sendOutOfEventNotification() {
        this.recordSendingNotification();
        this.spawnNotification("No event info, not tracking time. :(", (e) => {
            e.target.close();
            window.focus()
        })
    }

    timeSinceLastEventSec() {
        const nowTimestamp = moment().unix() * 1000;
        let minTimeSinceLastEvent = Number.MAX_VALUE;
        this.props.events.forEach((event) => {
            if (nowTimestamp > event.startTime) {
                let endTimestamp = event.startTime + event.durationSecs * 1000;
                if (nowTimestamp < endTimestamp) {
                    // We are currently in this event, use -1 as a sentinel value
                    minTimeSinceLastEvent = -1;
                } else {
                    minTimeSinceLastEvent = Math.min(
                        minTimeSinceLastEvent,
                        nowTimestamp - endTimestamp,
                    )
                }
            }
        });
        return minTimeSinceLastEvent / 1000;
    }

    beginLoop() {
        let loop = () => {
            if (!this.state.enabled) {
                return;
            }

            // If it hasn't been more than FORCED_INTERVAL seconds, we aren't allowed to send
            // another notification
            if (moment().unix() - this.state.lastNotificationTime < FORCED_INTERVAL) {
                return;
            }

            let timeSinceLastEvent = this.timeSinceLastEventSec();
            if (timeSinceLastEvent < 0) {
                // Currently in event still
                return;
            }

            // Regardless of the loop freq, we want to make the notification progressively more
            // likely to happen until we are in an event.
            // We will target 100% notification probability after LAG_THRESHOLD seconds and linear
            // probability back down.
            if (Math.random() < timeSinceLastEvent / LAG_THRESHOLD) {
                this.sendOutOfEventNotification();
            }

            // TODO: Also notify if we don't have a task in progress?
        };

        this.loopId = setInterval(loop.bind(this), LOOP_FREQ * 1000);
    }

    render() {
        return <div />
    }
}

import * as React from "react";
import * as moment from "moment";

import {EditEventComponent} from "./edit_event"
import {Event, User, TagsById} from "../../models"

export interface CalendarProps {
    meUser: User,
    events: Array<Event>,
    tagsById: TagsById,
    createEvent: (event: Event) => void,
    updateEvent: (event: Event) => void,
    deleteEvent: (event: Event) => void,
}
export interface CalendarState {
    startDayTimestamp: number,
    columns: Array<Array<Event>>,
    editingEvent?: Event,
}

export class CalendarComponent extends React.Component<CalendarProps, CalendarState> {

    constructor(props: CalendarProps) {
        super(props);

        this.state = this.getState(props)
    }

    componentWillReceiveProps(props: CalendarProps) {
        this.setState(this.getState(props))
    }

    getState(props: CalendarProps) {
        const startDayTimestamp = moment().startOf("week").add(1, "days").unix() * 1000;
        const columns = this.divideAndSort(startDayTimestamp, props.events);
        const newState: CalendarState = {
            startDayTimestamp,
            columns,
            editingEvent: null,
        };
        if (this.state) {
            newState.startDayTimestamp = this.state.startDayTimestamp;
            newState.editingEvent = this.state.editingEvent;
        }
        return newState;
    }

    divideAndSort(startTimestamp: number, events: Array<Event>): Array<Array<Event>> {
        // Note that the columns will be ordered with the weekend at the end.
        const columnList: Array<Array<Event>> = [[], [], [], [], [], [], []];

        let dayStart = moment(startTimestamp); // From seconds back into moment

        // Divide the events by start day
        events.forEach((event: Event) => {
            const days = moment(event.startTime).diff(dayStart, "days");
            if (days < 0 || days >= 7) {
                return
            }
            columnList[days].push(event);
        });

        // TODO: Sort the events

        return columnList;
    }

    onDoubleClick(event: Event) {
        this.state.editingEvent = event;
        this.setState(this.state);
    }

    changeWeek() {
        // TODO: implement pagination
    }

    renderColumn(columnName: string, column: Array<Event>) {
        return <div key={columnName} className="column-container">
            {columnName}
            {column.map((event: Event) => {
                return <div
                    key={event.id}
                    className="rendered-event card"
                    onDoubleClick={this.onDoubleClick.bind(this, event)}
                >
                    <div className="event-id-container">E{event.id}</div>
                    {event.name}
                </div>
            })}
        </div>
    }

    renderColumns() {
        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        return <div className="full-column-container">
            {days.map((dayName: string, i: number) => {
                return this.renderColumn(days[i], this.state.columns[i])
            })}
        </div>
    }

    renderEditingEvent() {
        if (!this.state.editingEvent) {
            return
        }
        return <EditEventComponent
            meUser={this.props.meUser}
            event={this.state.editingEvent}
            tagsById={this.props.tagsById}
            createMode={false}
            createEvent={(event: Event) => {}}
            updateEvent={this.props.updateEvent}
            deleteEvent={this.props.deleteEvent}
        />
    }

    renderCreateEvent() {
        return <EditEventComponent
            meUser={this.props.meUser}
            tagsById={this.props.tagsById}
            createMode={true}
            createEvent={this.props.createEvent}
            updateEvent={(event: Event) => {}}
            deleteEvent={(event: Event) => {}}
        />
    }

    render() {
        return <div className="calendar">
            {this.renderColumns()}
            {this.renderEditingEvent()}
            {this.renderCreateEvent()}
        </div>
    }
}
import * as React from "react";
import * as moment from "moment";

import {EditEventComponent} from "./edit_event"
import {Event, User, TagsById, Tag} from "../../models"
import {Tokenizable, TokenizerComponent} from "../tokenizer";

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
    createEventTimestamp?: number,
    selectedTag?: Tag,
}
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export class CalendarComponent extends React.Component<CalendarProps, CalendarState> {

    constructor(props: CalendarProps) {
        super(props);

        this.state = this.getState(props)
    }

    componentWillReceiveProps(props: CalendarProps) {
        this.setState(this.getState(props))
    }

    getState(props: CalendarProps) {
        let startDayMoment = moment().startOf("week").add(1, "days");
        if (startDayMoment > moment()) {
            // It must be Sunday, handle the edge case by subtracting off a week.
            startDayMoment = startDayMoment.subtract(1, "week");
        }
        const startDayTimestamp = startDayMoment.unix() * 1000;

        const columns = this.divideAndSort(startDayTimestamp, props.events);
        const newState: CalendarState = {
            startDayTimestamp,
            columns,
            editingEvent: null,
            createEventTimestamp: null,
            selectedTag: null,
        };
        if (this.state) {
            newState.startDayTimestamp = this.state.startDayTimestamp;
            newState.editingEvent = this.state.editingEvent;
            newState.createEventTimestamp = this.state.createEventTimestamp;

            if (this.state.selectedTag && props.tagsById[this.state.selectedTag.id]) {
                newState.selectedTag = this.state.selectedTag;
            }
        }
        return newState;
    }

    divideAndSort(startTimestamp: number, events: Array<Event>): Array<Array<Event>> {
        // Note that the columns will be ordered with the weekend at the end.
        const columnList: Array<Array<Event>> = [[], [], [], [], [], [], []];

        let dayStart = moment(startTimestamp); // From seconds back into moment

        // I just died a little inside, refactor this to somewhere more re-usable.
        const allChildIdsOfSelectedTag: {[id: number]: boolean} = {};
        if (this.state && this.state.selectedTag) {
            const queue = [this.state.selectedTag];
            while (queue.length) {
                const curTag: Tag = queue.pop();
                allChildIdsOfSelectedTag[curTag.id] = true;
                for (let tagId of curTag.childTagIds) {
                    if (!allChildIdsOfSelectedTag[tagId]) {
                        queue.push(this.props.tagsById[tagId]);
                    }
                }
            }
        }

        const shouldHide = (event: Event, day: number) => {
            if (day < 0 || day >= 7) {
                return true;
            }

            if (this.state && this.state.selectedTag) {
                // See if the task has the right tag
                let matches = false;
                event.tagIds.forEach((tagId: number) => {
                    matches = matches || allChildIdsOfSelectedTag[tagId]
                });
                if (!matches) {
                    return true;
                }
            }

            return false;
        };

        // Divide the events by start day
        events.forEach((event: Event) => {
            const day = moment(event.startTime).diff(dayStart, "days");
            if (shouldHide(event, day)) {
                return;
            }

            columnList[day].push(event);
        });

        // TODO: Sort the events

        return columnList;
    }

    resort() {
        // Recompute all the events and where to render them:
        this.state.columns = this.divideAndSort(this.state.startDayTimestamp, this.props.events);
        this.setState(this.state);
    }

    onDoubleClick(event: Event) {
        this.state.editingEvent = event;
        this.setState(this.state);
    }

    changeWeek() {
        // TODO: implement pagination
    }

    createEventAtTime(day: string, index: number) {
        let offset = index;
        DAYS.forEach((curDay: string, i: number) => {
            if (curDay != day) {
                return
            }
            offset += i * (60 * 60 * 24);
        });

        this.state.createEventTimestamp = (
            moment(this.state.startDayTimestamp).add(offset, "seconds").unix() * 1000
        );
        this.setState(this.state);
    }

    getCurrentTagToken(): Array<Tokenizable> {
        if (!this.state.selectedTag) {
            return [];
        }

        return [{
            label: this.state.selectedTag.name,
            value: this.state.selectedTag.id,
        }]
    }

    changeCurrentTagToken(newTokens: Array<Tokenizable>) {
        if (newTokens.length) {
            this.state.selectedTag = this.props.tagsById[newTokens[0].value];
        } else {
            this.state.selectedTag = null;
        }

        this.resort();
    }

    getAllTagNames(): Array<Tokenizable> {
        // This function is used to determine the set of valid tokens for the tokenizer.
        // We should think about excluding tokens from here that would cause cycles.
        const allNames: Array<Tokenizable> = [];
        Object.keys(this.props.tagsById).forEach((tagId) => {
            const tag = this.props.tagsById[+tagId];
            allNames.push({
                label: tag.name,
                value: tag.id
            })
        });
        return allNames;
    }

    renderTagSelector() {
        return (
            <div className="tag-selector-container">
                <div className="tag-selector-label">Filter Tag:</div>
                <TokenizerComponent
                    onChange={this.changeCurrentTagToken.bind(this)}
                    initialValues={this.getCurrentTagToken()}
                    possibleTokens={this.getAllTagNames()}
                    tokenLimit={1}
                />
            </div>
        )
    }

    renderOptions() {
        return (
            <div className="options">
                {this.renderTagSelector()}
            </div>
        )
    }

    renderCells(day: string) {
        const getColumnRow = (index: number) => {
            const key = "" + index;
            const style = {height: 20};
            if (day == "times") {
                let timeHeader = "";
                if (index % 1800 == 0) {
                    // Only print every 30 minutes
                    timeHeader = moment(this.state.startDayTimestamp)
                        .add(index, "seconds").format("h:mm a");
                }
                return (
                    <tr key={key} style={style}>
                        <td>{timeHeader}</td>
                    </tr>
                )
            } else {
                return (
                    <tr key={key} style={style}>
                        <td onClick={this.createEventAtTime.bind(this, day, index)}>{" "}</td>
                    </tr>
                )
            }
        };

        let i = 0; // midnight
        const tableRows: Array<any> = [];
        for ( ; i < 60 * 60  * 24; i += 60 * 15) {
            tableRows.push(getColumnRow(i));
        }
        return (
            <table cellPadding="0" cellSpacing="0">
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        )
    }

    renderColumn(columnIndex: number, column: Array<Event>) {
        const day = DAYS[columnIndex];
        return <div key={day} className="column-container">
            {this.renderCells(day)}
            {column.map((event: Event) => {
                // TODO: Handle days that go off the end or wrap multiple days better

                let dayOffset = event.startTime - (
                    this.state.startDayTimestamp + columnIndex * 24 * 60 * 60 * 1000);
                dayOffset /= (900 * 1000 * (4 * 24));
                dayOffset *= 20 * 4 * 24; // Total height of a column
                const style = {
                    "maxHeight": (event.durationSecs / 900) * 20,
                    "top": `${dayOffset}px`
                };
                return <div
                    key={event.id}
                    className="rendered-event card"
                    onDoubleClick={this.onDoubleClick.bind(this, event)}
                    style={style}
                >
                    <div className="event-id-container">E{event.id}</div>
                    {event.name}
                </div>
            })}
        </div>
    }

    renderColumns() {
        return <div className="full-column-container">
            <div className="column-header-container">
                <div className="column-header">Time</div>
                {DAYS.map((day: string) => {
                    return <div key={day} className="column-header">{day}</div>
                })}
            </div>
            <div className="all-columns-container">
                <div className="column-container -times">
                    {this.renderCells("times")}
                </div>
                {[0, 1, 2, 3, 4, 5, 6].map((index: number, i: number) => {
                    return this.renderColumn(index, this.state.columns[i])
                })}
            </div>
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
            initialCreationTime={this.state.createEventTimestamp}
            createEvent={this.props.createEvent}
            updateEvent={(event: Event) => {}}
            deleteEvent={(event: Event) => {}}
        />
    }

    render() {
        return <div className="calendar">
            {this.renderOptions()}
            {this.renderColumns()}
            {this.renderEditingEvent()}
            {this.renderCreateEvent()}
        </div>
    }
}
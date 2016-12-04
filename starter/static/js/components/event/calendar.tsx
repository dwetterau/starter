import * as jQuery from "jquery";
import * as React from "react";
import * as moment from "moment";

import {EditEventComponent} from "./edit_event"
import {Event, User, TagsById, Tag} from "../../models"
import {Tokenizable, TokenizerComponent} from "../tokenizer";
import {EventComponent} from "./event";

export interface CalendarProps {
    meUser: User,
    events: Array<Event>,
    tagsById: TagsById,
    createEvent: (event: Event) => void,
    updateEvent: (event: Event) => void,
    deleteEvent: (event: Event) => void,
}
export interface CalendarState {
    viewType: CalendarViewType,
    startDayTimestamp: number,
    columns: Array<Array<Event>>,
    cellHeight: number,
    editingEvent?: Event,
    createEventTimestamp?: number,
    createEventDurationSecs?: number,
    selectedTag?: Tag,
    draggingStartTimestamp?: number,
    draggingEndTimestamp?: number,
    draggingEvent?: Event,
    endDraggingEvent?: Event,
}
enum CalendarViewType {
    week,
    day,
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
            viewType: CalendarViewType.week,
            startDayTimestamp,
            columns,
            cellHeight: 20,
            editingEvent: null,
            createEventTimestamp: null,
            createEventDurationSecs: null,
            selectedTag: null,
            draggingStartTimestamp: null,
            draggingEndTimestamp: null,
            draggingEvent: null,
            endDraggingEvent: null,
        };
        if (this.state) {
            newState.cellHeight = this.state.cellHeight;

            // Needed to preserve view
            newState.viewType = this.state.viewType;

            // Needed for pagination
            newState.startDayTimestamp = this.state.startDayTimestamp;

            // Want to persist tag between event creations
            if (this.state.selectedTag && props.tagsById[this.state.selectedTag.id]) {
                newState.selectedTag = this.state.selectedTag;
            }
        }
        return newState;
    }

    componentDidMount() {
        const cursor = document.getElementsByClassName("current-time-cursor");
        if (cursor.length) {
            cursor[0].scrollIntoView();
        }
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

        const shouldHide = (event: Event) => {
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
            const startTimestamp = event.startTime;
            const endTimestamp = startTimestamp + event.durationSecs * 1000;
            DAYS.forEach((day: string, index: number) => {
                if (shouldHide(event)) {
                    return;
                }
                let curTimestamp = moment(dayStart).add(index, "days").unix() * 1000;

                // See if any part of the event falls within this day. If the part that does does
                // not include the beginning, we need to make a fake event. There should only
                // be at most one event in each column for the same event.
                if (curTimestamp < endTimestamp) {
                    if (curTimestamp >= startTimestamp) {
                        // We are in a partial day, create a fake event.
                        columnList[index].push(event)
                    } else if (curTimestamp + 24 * 60 * 60 * 1000 > startTimestamp) {
                        // This day contains the start timestamp, push it on as normal.
                        columnList[index].push(event)
                    }
                }
            });
        });

        // TODO: Sort the events ?

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

    computeTimestamp(day: string, index: number): number {
        let offset = index;
        DAYS.forEach((curDay: string, i: number) => {
            if (curDay != day) {
                return
            }
            offset += i * (60 * 60 * 24);
        });
        return moment(this.state.startDayTimestamp).add(offset, "seconds").unix() * 1000;
    }

    cellMouseDown(day: string, index: number, event: any) {
        this.state.draggingStartTimestamp = this.computeTimestamp(day, index);
        this.state.draggingEndTimestamp = this.state.draggingStartTimestamp;
        this.updateCreateEventTimestamp();

        this.setState(this.state);
        event.preventDefault();
    }

    updateCreateEventTimestamp() {
        if (this.state.draggingEndTimestamp < this.state.draggingStartTimestamp) {
            // We dragged backwards, use the end timestamp
            this.state.createEventTimestamp = this.state.draggingEndTimestamp;
        } else {
            // Just set the start timestamp
            this.state.createEventTimestamp = this.state.draggingStartTimestamp;
        }
    }

    updateCreateEventDurationSecs() {
        let start: number, end: number;
        if (this.state.draggingEndTimestamp < this.state.draggingStartTimestamp) {
            start = this.state.draggingEndTimestamp;
            end = this.state.draggingStartTimestamp;
        } else {
            start = this.state.draggingStartTimestamp;
            end = this.state.draggingEndTimestamp;
        }

        let duration = (end - start);
        duration /= 1000; // convert to seconds
        duration += 900; // dragging to the same cell means 15 minutes, so we always add 900 seconds

        this.state.createEventDurationSecs = duration;
    }

    cellMouseOver(day: string, index: number) {
        if (!this.state.draggingStartTimestamp) {
            // No dragging was happening, nothing to do.
            return
        }
        this.state.draggingEndTimestamp = this.computeTimestamp(day, index);
        this.updateCreateEventTimestamp();
        this.updateCreateEventDurationSecs();
        this.setState(this.state);
    }

    cellMouseUp(day: string, index: number) {
        if (!this.state.draggingStartTimestamp) {
            // No dragging was happening, nothing to do.
            return
        }

        this.state.draggingEndTimestamp = this.computeTimestamp(day, index);
        this.updateCreateEventTimestamp();
        this.updateCreateEventDurationSecs();

        this.state.draggingStartTimestamp = null;
        this.state.draggingEndTimestamp = null;
        this.setState(this.state);

        // Move focus to the event name field
        jQuery("input#event-name").focus();
    }

    _dragTargetEventElement: any = null;
    onDrop(day: string, index: number) {
        if (this.state.draggingEvent) {
            // Update the event with the new timestamp
            this.state.draggingEvent.startTime = this.computeTimestamp(day, index);
            this.props.updateEvent(this.state.draggingEvent);

            this.state.draggingEvent = null;
            this.setState(this.state);
            this._dragTargetEventElement.show();
        } else if (this.state.endDraggingEvent) {

            const timestamp = this.computeTimestamp(day, index);
            let newDuration = timestamp - this.state.endDraggingEvent.startTime;
            newDuration = Math.max(Math.round(newDuration / 1000) + 900, 900);
            this.state.endDraggingEvent.durationSecs = newDuration;
            this.props.updateEvent(this.state.endDraggingEvent);

            this.state.endDraggingEvent = null;
            this.setState(this.state)

        } else {
            // No event was being dragged
            return
        }
    }

    onDropPassThrough(event: any) {
        const xPos = event.clientX;
        const yPos = event.clientY;

        // Hide the element
        jQuery(event.currentTarget).hide();
        const dropTargetBelow = jQuery(document.elementFromPoint(xPos, yPos));
        if (dropTargetBelow.prop("tagName") == "TD") {
            // Great, we found a cell that we can actually finish dropping into
            const data = dropTargetBelow.data();
            this.onDrop(data.day, data.index)
        } else {
            // TODO: Try again? Could have many stacked divs here.
        }

        // Show the element again
        jQuery(event.currentTarget).show();
        event.preventDefault();
        event.stopPropagation();
    }

    onDragOverPassThrough(event: any) {
        event.preventDefault();
        event.stopPropagation();
    }

    onDragStart(event: Event, dragEvent: DragEvent) {
        if (this.state.endDraggingEvent || this.state.draggingEvent) {
            throw Error("Already was dragging an event...")
        }
        this.state.draggingEvent = event;
        this.setState(this.state);
        this._dragTargetEventElement = jQuery(dragEvent.target)
    }

    onDragEnd(event: Event) {
        if (this.state.draggingEvent != event) {
            return
        }

        this.state.draggingEvent = null;
        this.setState(this.state);
        this._dragTargetEventElement.show();
    }

    onEventEndDragStart(event: Event) {
        if (this.state.endDraggingEvent || this.state.draggingEvent) {
            throw Error("Already dragging an event...");
        }
        this.state.endDraggingEvent = event;
        this.setState(this.state);
    }

    onEventEndDragEnd(event: Event) {
        if (this.state.endDraggingEvent != event) {
            return
        }
        this.state.endDraggingEvent = null;
        this.setState(this.state);
    }

    onDragOver(day: string, index: number, event: any) {
        if (this.state.draggingEvent) {
            this._dragTargetEventElement.hide();

            const timestamp = this.computeTimestamp(day, index);
            const endTimestamp = timestamp + this.state.draggingEvent.durationSecs * 1000;

            if (this.state.draggingStartTimestamp != timestamp ||
                    this.state.draggingEndTimestamp != endTimestamp) {

                this.state.draggingStartTimestamp = timestamp;
                this.state.draggingEndTimestamp = endTimestamp;
                this.setState(this.state);
            }
        } else if (this.state.endDraggingEvent) {
            const timestamp = this.computeTimestamp(day, index);
            this.state.draggingEndTimestamp = timestamp;

            if (this.state.draggingStartTimestamp !=  this.state.endDraggingEvent.startTime ||
                    this.state.draggingEndTimestamp != timestamp) {

                this.state.draggingStartTimestamp = this.state.endDraggingEvent.startTime;
                this.state.draggingEndTimestamp = timestamp;
                this.setState(this.state);
            }
        } else {
            // Nothing being dragged
            return
        }
        event.preventDefault()
    }

    onDragLeave(day: string, index: number, event: any) {
        if (this.state.draggingEvent) {
            if (this.state.draggingStartTimestamp) {
                const timestamp = this.computeTimestamp(day, index);
                // Clear out the dragging info if we were the last one that was dragged over.
                if (timestamp == this.state.draggingStartTimestamp) {
                    this.state.draggingStartTimestamp = null;
                    this.state.draggingEndTimestamp = null;
                    this.setState(this.state);
                }
            }
        } else if (this.state.endDraggingEvent) {
            if (this.state.draggingEndTimestamp) {
                const timestamp = this.computeTimestamp(day, index);
                if (timestamp == this.state.draggingEndTimestamp) {
                    this.state.draggingStartTimestamp = null;
                    this.state.draggingEndTimestamp = null;
                    this.setState(this.state);
                }
            }
        }
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

    changeCellHeight(event: any) {
        this.state.cellHeight = (event.target.value);
        this.setState(this.state)
    }

    renderCellSizeSlider() {
        return (
            <div className="cell-size-slider">
                <input
                    type="range"
                    min="20"
                    max="100"
                    value={this.state.cellHeight}
                    onChange={this.changeCellHeight.bind(this)}
                />
            </div>
        )
    }

    renderOptions() {
        return (
            <div className="options">
                {this.renderCellSizeSlider()}
                {this.renderTagSelector()}
            </div>
        )
    }

    renderCells(day: string) {
        const getColumnRow = (index: number) => {
            const key = "" + index;
            const style = {height: `${this.state.cellHeight}px`};
            const timestamp = this.computeTimestamp(day, index);
            let className = "";
            if (this.state.draggingStartTimestamp && this.state.draggingEndTimestamp) {
                // We are currently dragging, see if this cell is in the range
                let start = this.state.draggingStartTimestamp;
                let end = this.state.draggingEndTimestamp;
                if (end < start) {
                    start = this.state.draggingEndTimestamp;
                    end = this.state.draggingStartTimestamp;
                }

                if (timestamp >= start && timestamp < end + (900 * 1000)) {
                    className = "-selected";
                }
            }

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
                        <td className={className}
                            data-day={day}
                            data-index={index}
                            onMouseDown={this.cellMouseDown.bind(this, day, index)}
                            onMouseOver={this.cellMouseOver.bind(this, day, index)}
                            onMouseUp={this.cellMouseUp.bind(this, day, index)}
                            onDrop={this.onDrop.bind(this, day, index)}
                            onDragOver={this.onDragOver.bind(this, day, index)}
                            onDragLeave={this.onDragLeave.bind(this, day, index)}
                        >
                            {" "}
                        </td>
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

    renderCurrentTimeCursor(index: number) {
        const columnTimeRange = 24 * 60 * 60 * 1000;
        let columnStartTimestamp = this.state.startDayTimestamp + index * columnTimeRange;
        const currentTime = moment().unix() * 1000;
        if (currentTime >= columnStartTimestamp &&
            currentTime < columnStartTimestamp + columnTimeRange) {
            // Okay we can actually render it here.
            let offset = (currentTime - columnStartTimestamp) / columnTimeRange;
            offset *=  this.state.cellHeight * 4 * 24; // Total height of a column
            offset -= 2; // Draw it 2 pixels higher because it's width 3.
            const style = {
                "top": `${offset}px`,
            };
            return <div className="current-time-cursor" style={style}></div>
        }
    }

    renderColumn(columnIndex: number, column: Array<Event>) {
        const day = DAYS[columnIndex];
        return <div key={day} className="column-container">
            {this.renderCells(day)}
            {this.renderCurrentTimeCursor(columnIndex)}
            {column.map((event: Event) => {
                let dayOffset = event.startTime - (
                    this.state.startDayTimestamp + columnIndex * 24 * 60 * 60 * 1000);
                dayOffset /= (900 * 1000 * (4 * 24));
                dayOffset *= this.state.cellHeight * 4 * 24; // Total height of a column
                let multiDayAdjustment = 0;
                if (dayOffset < 0) {
                    multiDayAdjustment = -dayOffset;
                    dayOffset = 0;
                }
                let height = (event.durationSecs / 900) * this.state.cellHeight;
                height -= multiDayAdjustment;
                let bottomOverflow = (this.state.cellHeight * 4 * 24) - (dayOffset + height);
                if (bottomOverflow < 0) {
                    height += bottomOverflow;
                }

                const style = {
                    "height": `${height}px`,
                    "maxHeight": `${height}px`,
                    "top": `${dayOffset}px`
                };
                return (
                    <div
                        className="rendered-event-container"
                        key={event.id}
                        style={style}
                        onDrop={this.onDropPassThrough.bind(this)}
                        onDragOver={this.onDragOverPassThrough}
                    >
                        <div
                            className="rendered-event card"
                            draggable={true}
                            onDragStart={this.onDragStart.bind(this, event)}
                            onDragEnd={this.onDragEnd.bind(this, event)}
                            onDoubleClick={this.onDoubleClick.bind(this, event)}
                        >
                            <EventComponent
                                event={event}
                                tagsById={this.props.tagsById}
                            />
                        </div>
                        <div className="draggable-event-end"
                             draggable={true}
                             onDragStart={this.onEventEndDragStart.bind(this, event)}
                             onDragEnd={this.onEventEndDragEnd.bind(this, event)}
                        />
                    </div>
                );
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
        const initialTags: Array<number> = [];
        if (this.state.selectedTag) {
            initialTags.push(this.state.selectedTag.id)
        }
        return <EditEventComponent
            meUser={this.props.meUser}
            tagsById={this.props.tagsById}
            createMode={true}
            initialTags={initialTags}
            initialCreationTime={this.state.createEventTimestamp}
            initialDurationSecs={this.state.createEventDurationSecs}
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
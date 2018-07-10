import * as jQuery from "jquery";
import * as moment from "moment";
import * as React from "react";

import {EditEventComponent} from "./edit_event"
import {Event, User, TagsById, Tag, TasksById, Task, EventsById} from "../../models"
import {Tokenizable, TokenizerComponent} from "../tokenizer";
import {EventComponent} from "./event";
import {ModalComponent} from "../lib/modal";
import {debounce, getTagAndDescendantsRecursive} from "../lib/util";

export interface CalendarProps {
    meUser: User,
    eventsById: EventsById,
    tagsById: TagsById,
    tasksById: TasksById,
    simpleOptions: boolean,
    createEvent: (event: Event) => void,
    updateEvent: (event: Event) => void,
    deleteEvent: (event: Event) => void,
    
    selectedTag?: Tag,
    changeSelectedTag: (tag?: Tag) => void,
    view: CalendarView,
    changeView: (view: CalendarView) => void,
}
export interface CalendarState {
    columns: Array<Array<number>>,
    showCreate: boolean,
    eventToRenderingInfo: {[eventKey: string]: EventRenderingInfo},
    editingEvent?: Event,
    createEventTimestamp?: number,
    createEventDurationSecs?: number,
    createEventTask?: Task,
    draggingStartTimestamp?: number,
    draggingEndTimestamp?: number,
    draggingEvent?: Event,
    endDraggingEvent?: Event,
}

export interface CalendarView {
    type: CalendarViewType,
    startDayTimestamp: number,
    cellHeight: number,
    initial: boolean,
}

export enum CalendarViewType {
    week,
    day,
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const GRANULARITY = 1800; // Each cell is 30 minutes (unit in seconds)

const DEFAULT_CELL_HEIGHT = 25;
const MIN_CELL_HEIGHT = 20;

interface EventRenderingInfo {
    index: number
    columnWidth: number
    extraCols: number

    height: number
    top: number
}

export class CalendarComponent extends React.Component<CalendarProps, CalendarState> {

    constructor(props: CalendarProps) {
        super(props);

        this.state = this.getState(props)
    }

    refreshLoopId = 0;

    componentWillReceiveProps(props: CalendarProps) {
        this.setState(this.getState(props))
    }

    getState(props: CalendarProps) {
        const [columns, eventToRenderingInfo] = CalendarComponent.divideAndSort(
            props.view,
            props.eventsById,
            props.selectedTag,
            props.tagsById,
        );

        return {
            columns,
            showCreate: (this.state) ? this.state.showCreate : false,
            eventToRenderingInfo: eventToRenderingInfo,
            editingEvent: null,
            createEventTimestamp: null,
            createEventDurationSecs: null,
            createEventTask: null,
            draggingStartTimestamp: null,
            draggingEndTimestamp: null,
            draggingEvent: null,
            endDraggingEvent: null,
        };
    }

    static getInitialView(type: CalendarViewType): CalendarView {
        return {
            type: type,
            startDayTimestamp: this.computeTodayStartTime(type),
            cellHeight: DEFAULT_CELL_HEIGHT,
            initial: true,
        };
    }

    componentDidMount() {
        const cursor = document.getElementsByClassName("current-time-cursor");
        if (cursor.length) {
            // Scroll the calendar view so that the current time is in the middle.
            const container = document.getElementsByClassName("all-columns-container")[0];
            const top = jQuery(cursor[0]).data("top");
            container.scrollTop = top - container.clientHeight / 2;
        }

        // Register a loop to keep refreshing the cursor.
        let loop = () => {
            this.forceUpdate();
        };
        this.refreshLoopId = window.setInterval(loop, 60 * 1000);
    }

    componentWillUnmount() {
        if (this.refreshLoopId) {
            window.clearInterval(this.refreshLoopId)
        }
    }

    static computeTodayStartTime(viewType: CalendarViewType): number {
        let startDayMoment: moment.Moment;
        if (viewType == CalendarViewType.week) {
            startDayMoment = this.computeClosestMonday(moment())
        } else {
            startDayMoment = moment().startOf("day")
        }
        return startDayMoment.unix() * 1000;
    }

    static computeClosestMonday(m: moment.Moment): moment.Moment {
        let startDayMoment = moment(m).startOf("week").add(1, "days");
        if (startDayMoment > moment(m)) {
            // It must be Sunday, handle the edge case by subtracting off a week.
            startDayMoment = startDayMoment.subtract(1, "week");
        }
        return startDayMoment
    }

    static getEventKey(eventId: number, columnIndex: number): string {
        return `${eventId}-${columnIndex}`
    }

    static divideAndSort(
        view: CalendarView,
        eventsById: EventsById,
        selectedTag: Tag,
        tagsById: TagsById,
    ): [Array<Array<number>>, {[eventId: string]: EventRenderingInfo}] {

        let columnList: Array<Array<number>>;
        if (view.type == CalendarViewType.week) {
            // Note that the columns will be ordered with the weekend at the end.
             columnList = [[], [], [], [], [], [], []];
        } else {
            columnList = [[]]
        }

        let dayStart = moment(view.startDayTimestamp); // From seconds back into moment

       let allChildIdsOfSelectedTag: {[id: number]: boolean} = {};
        if (selectedTag) {
            allChildIdsOfSelectedTag = getTagAndDescendantsRecursive(
                selectedTag.id,
                tagsById
            );
        }

        const shouldHide = (event: Event) => {
            if (selectedTag) {
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
        for (let eventId of Object.keys(eventsById)) {
            let event = eventsById[eventId];
            if (shouldHide(event)) {
                continue;
            }
            const startTimestamp = event.startTime;
            const endTimestamp = startTimestamp + event.durationSecs * 1000;
            for (let index in DAYS) {
                let curTimestamp = moment(dayStart).add(index, "days").unix() * 1000;

                // See if any part of the event falls within this day. If the part that does does
                // not include the beginning, we need to make a fake event. There should only
                // be at most one event in each column for the same event.
                if (curTimestamp < endTimestamp) {
                    if (curTimestamp >= startTimestamp) {
                        // We are in a partial day, create a fake event.
                        columnList[index].push(parseInt(eventId))
                    } else if (curTimestamp + 24 * 60 * 60 * 1000 > startTimestamp) {
                        // This day contains the start timestamp, push it on as normal.
                        columnList[index].push(parseInt(eventId))
                    }
                }

                // This is pretty hacky, make this cleaner later
                if (view.type == CalendarViewType.day) {
                    // We only want to iterate once if we're in day view
                    break;
                }
            }
        }

        columnList.forEach((column) => {
            column.sort((eventId1, eventId2) => {
                let event1 = eventsById[eventId1];
                let event2 = eventsById[eventId2];
                const diff = event1.startTime - event2.startTime;
                if (diff != 0) {
                    return diff;
                }

                // We want the larger events to be sorted first if they have the same start time
                return event2.durationSecs - event1.durationSecs;
            })
        });

        // After sorting the events, run the division alg on each column
        const eventToRenderingInfo: {[eventKey: string]: EventRenderingInfo} = {};

        let overlaps = (
            idTopAndHeight: {id: number, top: number, height: number},
            top: number,
        ) => {
            // To help with rounding errors
            let eps = 0.0000001;
            if (top >= idTopAndHeight.top + eps) {
                if (top < idTopAndHeight.top + idTopAndHeight.height - eps) {
                    return true;
                }
            }
            return false;
        };

        columnList.forEach((column, columnIndex) => {
            let columnStartTime = moment(dayStart).add(columnIndex, "days").unix() * 1000;
            let columnEndTime = moment(dayStart).add(columnIndex + 1, "days").unix() * 1000;

            // TODO: precompute the max size of aux in order to calculate extra space later.

            let aux: Array<{id: number, top: number, height: number}> = [];
            column.forEach((eventId) => {
                let top = null;
                let height = null;
                let event = eventsById[eventId];
                if (event.startTime < columnStartTime) {
                    // event started on a previous day.
                    top = 0;
                } else {
                    // event must start somewhere during this day.
                    let percentage = (event.startTime - columnStartTime) / (86400 * 1000);
                    top = percentage * view.cellHeight * (86400 / GRANULARITY);
                }
                let realEndTimestamp = Math.min(
                    event.startTime + (event.durationSecs * 1000),
                    columnEndTime,
                );
                let durationSecs = (realEndTimestamp - event.startTime) / 1000;
                if (event.startTime < columnStartTime) {
                    // Event started on an earlier day, deduct this from the duration
                    durationSecs -= (columnStartTime - event.startTime) / 1000;
                }
                // TODO: Keep short end of day events from hanging off the end.
                height = Math.max(
                    Math.min(view.cellHeight, MIN_CELL_HEIGHT),
                    (durationSecs / GRANULARITY) * view.cellHeight,
                );

                // Base case for the initial element
                if (!aux.length) {
                    aux.push({id: event.id, height, top});
                    eventToRenderingInfo[this.getEventKey(event.id, columnIndex)] = {
                        index: 0,
                        columnWidth: 1,
                        extraCols: 0,
                        height: height,
                        top: top,
                    };
                    return
                }

                let slotUsed = false;
                // If this event doesn't overlap with an element in the array, replace it.
                // During the replace, we need to calculate what the max width was for the element.
                aux.forEach((idTopAndHeight, index) => {
                    if (!idTopAndHeight || !overlaps(idTopAndHeight, top)) {
                        // Doesn't overlap, will use this slot (if it's the first) and evict
                        if (!slotUsed) {
                            slotUsed = true;
                            // Replace out this element
                            aux[index] = {id: event.id, top, height};
                            eventToRenderingInfo[this.getEventKey(event.id, columnIndex)] = {
                                index,
                                columnWidth: 0, // This will be resized later.
                                extraCols: 0, // This is determined later.
                                height: height,
                                top: top,
                            }
                        } else {
                            aux[index] = null;
                        }
                    }
                });


                // If this event overlaps with whatever is in aux, we must append
                if (!slotUsed) {
                    // Append to the end
                    aux.forEach((idTopAndHeight) => {
                        if (!idTopAndHeight) {
                            return
                        }
                        let key = this.getEventKey(idTopAndHeight.id, columnIndex);
                        eventToRenderingInfo[key].columnWidth = aux.length + 1;
                    });
                    eventToRenderingInfo[this.getEventKey(event.id, columnIndex)] = {
                        columnWidth: aux.length + 1,
                        index: aux.length,
                        extraCols: 0,
                        height: height,
                        top: top,
                    };
                    aux.push({id: event.id, top, height});
                } else {
                    // See if we need to resize aux
                    while (aux.length && aux[aux.length - 1] == null) {
                        aux.pop()
                    }
                    // Everything left in the aux array at this point must be overlapping at some point
                    let numNotNull = 0;
                    let maxWidth = aux.length;
                    aux.forEach((idTopAndHeight) => {
                        if (idTopAndHeight) {
                            numNotNull++;
                            maxWidth = Math.max(
                                maxWidth,
                                eventToRenderingInfo[
                                    this.getEventKey(idTopAndHeight.id, columnIndex)].columnWidth
                            );
                        }
                    });

                    aux.forEach((idTopAndHeight) => {
                        if (!idTopAndHeight) {
                            return
                        }
                        let key = this.getEventKey(idTopAndHeight.id, columnIndex);
                        const newWidth = Math.max(
                            numNotNull,
                            eventToRenderingInfo[key].columnWidth
                        );
                        eventToRenderingInfo[key].columnWidth = newWidth;
                        eventToRenderingInfo[key].extraCols = maxWidth - newWidth;
                    });
                }
            })
        });
        return [columnList, eventToRenderingInfo];
    }

    onDoubleClick(event: Event) {
        this.setState({editingEvent: event});
    }

    computeTimestamp(day: string, index: number): number {
        let offset = index;

        if (this.props.view.type == CalendarViewType.week) {
            DAYS.forEach((curDay: string, i: number) => {
                if (curDay != day) {
                    return
                }
                offset += i * (60 * 60 * 24);
            });
        }

        return moment(this.props.view.startDayTimestamp).add(offset, "seconds").unix() * 1000;
    }

    columnMouseDown(day: string, event: any) {
        let index = event.target.dataset.index * 1;
        const draggingStartTimestamp = this.computeTimestamp(day, index);
        const draggingEndTimestamp = this.state.draggingStartTimestamp;
        this.setState({
            draggingStartTimestamp,
            draggingEndTimestamp,
            createEventTimestamp: CalendarComponent.getCreateEventTimestamp(
                draggingStartTimestamp,
                draggingEndTimestamp,
            ),
        });

        event.preventDefault();
    }

    columnMouseOver(day: string, event: any) {
        if (!this.state.draggingStartTimestamp) {
            // No dragging was happening, nothing to do.
            return
        }
        let index = event.target.dataset.index * 1;
        const draggingEndTimestamp = this.computeTimestamp(day, index);
        this.setState({
            draggingEndTimestamp,
            createEventTimestamp: CalendarComponent.getCreateEventTimestamp(
                this.state.draggingStartTimestamp,
                draggingEndTimestamp,
            ),
            createEventDurationSecs: CalendarComponent.getCreateEventDurationSecs(
                this.state.draggingStartTimestamp,
                draggingEndTimestamp,
            )
        });
    }

    columnMouseUp(day: string, event: any) {
        if (!this.state.draggingStartTimestamp) {
            // No dragging was happening, nothing to do.
            return
        }

        let index = event.target.dataset.index * 1;
        const draggingEndTimestamp = this.computeTimestamp(day, index);
        this.setState({
            draggingStartTimestamp: null,
            draggingEndTimestamp: null,
            createEventTimestamp: CalendarComponent.getCreateEventTimestamp(
                this.state.draggingStartTimestamp,
                draggingEndTimestamp,
            ),
            createEventDurationSecs: CalendarComponent.getCreateEventDurationSecs(
                this.state.draggingStartTimestamp,
                draggingEndTimestamp,
            ),
            showCreate: true,
        });
    }

    static getCreateEventTimestamp(
        draggingStartTimestamp: number,
        draggingEndTimestamp: number,
    ): number {
        return Math.min(draggingStartTimestamp, draggingEndTimestamp);
    }

    static getCreateEventDurationSecs(
        draggingStartTimestamp: number,
        draggingEndTimestamp: number,
    ): number {
        let duration = Math.abs(draggingStartTimestamp - draggingEndTimestamp);
        duration /= 1000; // convert to seconds
        duration += GRANULARITY; // dragging to the same cell means to make duration equal to GRANULARITY
        return duration;
    }

    onDrop(day: string, index: number) {
        if (this.state.draggingEvent) {
            // Update the event with the new timestamp
            let eventToUpdate = this.state.draggingEvent;
            eventToUpdate.startTime = this.computeTimestamp(day, index);
            this.props.updateEvent(eventToUpdate);

            this.setState({draggingEvent: null});
        } else if (this.state.endDraggingEvent) {
            const timestamp = this.computeTimestamp(day, index);
            let newDuration = timestamp - this.state.endDraggingEvent.startTime;
            newDuration = Math.max(Math.round(newDuration / 1000) + GRANULARITY, GRANULARITY);

            let eventToUpdate = this.state.endDraggingEvent;
            eventToUpdate.durationSecs = newDuration;
            this.props.updateEvent(eventToUpdate);

            this.setState({endDraggingEvent: null});
        } else {
            // No event was being dragged
            return
        }
    }

    getDayAndIndexUnderneathEvent(event: any, callback: (day: string, index: number) => void) {
        const xPos = event.clientX;
        const yPos = event.clientY;

        // Hide the element
        jQuery(event.currentTarget).hide();
        const dropTargetBelow = jQuery(document.elementFromPoint(xPos, yPos));
        if (dropTargetBelow.prop("tagName") == "TD") {
            // Great, we found a cell that we can actually finish dropping into
            const data = dropTargetBelow.data();
            callback(data.day, data.index);
        }

        // Show the element again
        jQuery(event.currentTarget).show();
    }

    onDropPassThrough(event: any) {
        this.getDayAndIndexUnderneathEvent(event, this.onDrop.bind(this));

        event.preventDefault();
        event.stopPropagation();
    }

    onDragOverPassThrough(event: any) {
        this.getDayAndIndexUnderneathEvent(event, this.onDragOver.bind(this));

        event.preventDefault();
        event.stopPropagation();
    }

    onDragStart(event: Event, dragEvent: DragEvent) {
        if (this.state.endDraggingEvent || this.state.draggingEvent) {
            throw Error("Already was dragging an event...")
        }
        this.setState({draggingEvent: event});
        dragEvent.dataTransfer.setData('text/html', null);
    }

    onDragEnd(event: Event) {
        if (this.state.draggingEvent != event) {
            return
        }

        this.setState({
            draggingStartTimestamp: null,
            draggingEndTimestamp: null,
            draggingEvent: null,
        });
    }

    onEventEndDragStart(event: Event, dragEvent: DragEvent) {
        if (this.state.endDraggingEvent || this.state.draggingEvent) {
            throw Error("Already dragging an event...");
        }
        this.setState({endDraggingEvent: event});
        dragEvent.dataTransfer.setData('text/html', null);
    }

    onEventEndDragEnd(event: Event) {
        if (this.state.endDraggingEvent != event) {
            return
        }

        this.setState({
            draggingStartTimestamp: null,
            draggingEndTimestamp: null,
            endDraggingEvent: null,
        });
    }

    onDragOver(day: string, index: number, event: any) {
        // Watch out: This function is abused and needs refactoring. Event might be undefined,
        // index might be -1. Not at the same time though.
        if (event) {
            event.preventDefault()
        }
        if (index == -1) {
            index = event.target.dataset.index * 1;
        }
        if (this.state.draggingEvent) {
            const timestamp = this.computeTimestamp(day, index);
            // Conceptually this is needed because short events should register only a single cell
            // to be highlighted.
            const truncatedDuration = Math.max(0, this.state.draggingEvent.durationSecs - GRANULARITY);
            const endTimestamp = timestamp + truncatedDuration * 1000;

            if (this.state.draggingStartTimestamp != timestamp ||
                    this.state.draggingEndTimestamp != endTimestamp) {
                this.setState({
                    draggingStartTimestamp: timestamp,
                    draggingEndTimestamp: endTimestamp,
                });
            }
        } else if (this.state.endDraggingEvent) {
            const timestamp = this.computeTimestamp(day, index);
            if (this.state.draggingStartTimestamp !=  this.state.endDraggingEvent.startTime ||
                    this.state.draggingEndTimestamp != timestamp) {

                this.setState({
                    draggingStartTimestamp: this.state.endDraggingEvent.startTime,
                    draggingEndTimestamp: timestamp,
                });
            }
        } else {
            // Nothing being dragged
            return
        }
    }

    getCurrentTagToken(): Array<Tokenizable> {
        if (!this.props.selectedTag) {
            return [];
        }

        return [{
            label: this.props.selectedTag.name,
            value: this.props.selectedTag.id,
        }]
    }

    changeCurrentTagToken(newTokens: Array<Tokenizable>) {
        let selectedTag;
        if (newTokens.length) {
            selectedTag = this.props.tagsById[newTokens[0].value];
        } else {
            selectedTag = null;
        }
        this.props.changeSelectedTag(selectedTag);
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
        const currentView = this.props.view;
        currentView.cellHeight = event.target.value;
        this.props.changeView(currentView);
    }

    renderCellSizeSlider() {
        if (this.props.simpleOptions) {
            return;
        }
        return (
            <div className="cell-size-slider">
                <input
                    type="range"
                    min="20"
                    max="100"
                    value={this.props.view.cellHeight}
                    onChange={this.changeCellHeight.bind(this)}
                />
            </div>
        )
    }

    changeViewType(type: CalendarViewType) {
        if (this.props.view.type == type) {
            // No transition needed
            return
        }
        let startDayMoment: moment.Moment;
        let startDayTimestamp = this.props.view.startDayTimestamp;
        if (this.props.view.type == CalendarViewType.week && type == CalendarViewType.day) {
            // Week to day transition, need to either pick today or Monday
            const monday = moment(this.props.view.startDayTimestamp);
            const now = moment();
            if (now.unix() - monday.unix() > 0 && monday.add(1, "week").unix() - now.unix() > 0) {
                // Current week view contains today, we will use today as the answer.
                startDayTimestamp = CalendarComponent.computeTodayStartTime(type);
            } else {
                // Current week does not contain today, we will stay with Monday and no-op.
            }
            // TODO: Figure out what to do here with respect to pushing onto the history
        } else if (this.props.view.type == CalendarViewType.day && type == CalendarViewType.week) {
            // Day to week transition, need to find the nearest Monday
            startDayMoment = CalendarComponent.computeClosestMonday(
                moment(this.props.view.startDayTimestamp)
            );
            startDayTimestamp = startDayMoment.unix() * 1000;
            // TODO: Figure out what to do here with respect to pushing onto the history
        } else {
            throw Error("Unknown view type transition");
        }
        const currentView = this.props.view;
        currentView.startDayTimestamp = startDayTimestamp;
        currentView.type = type;
        this.props.changeView(currentView);
    }

    renderViewChoice(type: CalendarViewType) {
        let className = "view-type-choice";
        if (type == this.props.view.type) {
            className += " -selected"
        }
        const typeToName: {[type: number]: string} = {};
        typeToName[CalendarViewType.day] = "Day";
        typeToName[CalendarViewType.week] = "Week";

        return (
            <div className={className} key={type}
                 onClick={this.changeViewType.bind(this, type)}
            >
                {typeToName[type]}
            </div>
        )
    }

    renderChangeViewType() {
        if (this.props.simpleOptions) {
            return;
        }
        return (
            <div className="view-type-selector">
                {this.renderViewChoice(CalendarViewType.week)}
                {this.renderViewChoice(CalendarViewType.day)}
            </div>
        )
    }

    changePage(diff: number) {
        if (this.props.view.type == CalendarViewType.week) {
            diff *= 7;
        }
        // Diff is the difference in days to add to the current time. If it's 0, we reset back
        // to the current day.
        let startDayTimestamp;
        if (diff == 0) {
            startDayTimestamp = CalendarComponent.computeTodayStartTime(this.props.view.type)
        } else {
            startDayTimestamp = moment(
                this.props.view.startDayTimestamp).add(diff, "days").unix() * 1000;
        }
        const currentView = this.props.view;
        currentView.startDayTimestamp = startDayTimestamp;
        this.props.changeView(currentView);
    }

    renderPagination() {
        return (
            <div className="pagination-container">
                <div
                    className="pagination-option"
                    onClick={this.changePage.bind(this, -1)}
                >
                    Previous
                </div>
                <div
                    className="pagination-option"
                    onClick={this.changePage.bind(this, 1)}
                >
                    Next
                </div>
                <div
                    className="pagination-option"
                    onClick={this.changePage.bind(this, 0)}
                >
                    Today
                </div>
            </div>
        )
    }

    renderOptions() {
        return (
            <div className="options">
                {this.renderCellSizeSlider()}
                {this.renderTagSelector()}
                {this.renderChangeViewType()}
                {this.renderPagination()}
            </div>
        )
    }

    renderCells(day: string) {
        const getColumnRow = (index: number) => {
            const key = "" + index;
            const style = {height: `${this.props.view.cellHeight}px`};
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

                if (timestamp >= start && timestamp < end + (GRANULARITY * 1000)) {
                    className = "-selected";
                }
            }

            if (day == "times") {
                let timeHeader = "";
                if (index % (GRANULARITY * 2) == 0) {
                    timeHeader = moment(this.props.view.startDayTimestamp)
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
                        <td
                            className={className}
                            data-day={day}
                            data-index={index}
                            onDrop={this.onDrop.bind(this, day, index)}
                        >
                            {" "}
                        </td>
                    </tr>
                )
            }
        };

        let i = 0; // midnight
        const tableRows: Array<any> = [];
        for ( ; i < 60 * 60 * 24; i += GRANULARITY) {
            tableRows.push(getColumnRow(i));
        }
        return (
            <table
                cellPadding="0"
                cellSpacing="0"
                onMouseDown={this.columnMouseDown.bind(this, day)}
                onMouseOver={debounce(this.columnMouseOver.bind(this, day), 50)}
                onMouseUp={this.columnMouseUp.bind(this, day)}
                onDragOver={this.onDragOver.bind(this, day, -1)}
            >
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        )
    }

    renderCurrentTimeCursor(index: number) {
        const columnTimeRange = 24 * 60 * 60 * 1000;
        let columnStartTimestamp = this.props.view.startDayTimestamp + index * columnTimeRange;
        const currentTime = moment().unix() * 1000;
        if (currentTime >= columnStartTimestamp &&
            currentTime < columnStartTimestamp + columnTimeRange) {
            // Okay we can actually render it here.
            let offset = (currentTime - columnStartTimestamp) / columnTimeRange;
            offset *=  this.props.view.cellHeight * (86400 / GRANULARITY); // Total height of a column
            offset -= 2; // Draw it 2 pixels higher because it's width 3.
            const style = {
                "top": `${offset}px`,
            };
            return <div
                className="current-time-cursor"
                style={style}
                data-top={offset}
                onDrop={this.onDropPassThrough.bind(this)}
                onDragOver={this.onDragOverPassThrough.bind(this)}
            />
        }
    }

    renderColumn(columnIndex: number, column: Array<number>, singleDay?: boolean) {
        const day = DAYS[columnIndex];
        let className = "column-container";
        if (singleDay) {
            className += " single-day"
        }

        return <div key={day} className={className}>
            {this.renderCells(day)}
            {this.renderCurrentTimeCursor(columnIndex)}
            {column.map((eventId: number) => {
                // calculate the width change
                // TODO: The extra cols only work right now with the expand-to-the-right case
                const renderingInfo = this.state.eventToRenderingInfo[
                    CalendarComponent.getEventKey(eventId, columnIndex)];
                let width = renderingInfo.columnWidth;
                if (renderingInfo.extraCols) {
                    width += renderingInfo.extraCols;
                }
                const widthPercentage = (100.0 / width) * (1 + renderingInfo.extraCols);
                const marginLeft = widthPercentage * renderingInfo.index;

                // We subtract 2 from the height purely for stylistic reasons.
                const style = {
                    "height": `${renderingInfo.height}px`,
                    "maxHeight": `${renderingInfo.height}px`,
                    "top": `${renderingInfo.top}px`,
                    "marginLeft": `${marginLeft}%`,
                    "width": `${widthPercentage}%`,
                };
                let event = this.props.eventsById[eventId];
                return (
                    <div
                        className="rendered-event-container"
                        key={eventId}
                        style={style}
                        onDrop={this.onDropPassThrough.bind(this)}
                        onDragOver={this.onDragOverPassThrough.bind(this)}
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

    renderWeekViewColumns() {
        return <div className="full-column-container">
            <div className="header-and-content-container">
                <div className="column-header-container">
                    <div className="column-header -times">Time</div>
                    {DAYS.map((day: string, index: number) => {
                        let m = moment(this.props.view.startDayTimestamp).add(index, "days");
                        return <div key={day} className="column-header">
                            {m.format("ddd M/D")}
                        </div>
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
        </div>
    }

    renderTodayString(): string {
        return moment(this.props.view.startDayTimestamp).format("dddd M/D")
    }

    renderDayViewColumns() {
        return <div className="full-column-container">
            <div className="header-and-content-container">
                <div className="column-header-container">
                    <div className="column-header -times">Time</div>
                        <div className="column-header single-day">{this.renderTodayString()}</div>
                </div>
                <div className="all-columns-container">
                    <div className="column-container -times">
                        {this.renderCells("times")}
                    </div>
                    {[0].map((index: number, i: number) => {
                        return this.renderColumn(index, this.state.columns[i], true)
                    })}
                </div>
            </div>
        </div>
    }

    renderColumns() {
        if (this.props.view.type == CalendarViewType.week) {
            return this.renderWeekViewColumns()
        } else if (this.props.view.type == CalendarViewType.day) {
            return this.renderDayViewColumns()
        }
    }

    clearEditingEvent() {
        this.setState({editingEvent: null});
    }

    renderEditingEvent() {
        if (!this.state.editingEvent) {
            return
        }
        return <ModalComponent cancelFunc={this.clearEditingEvent.bind(this)}>
            <EditEventComponent
                meUser={this.props.meUser}
                event={this.state.editingEvent}
                eventsById={this.props.eventsById}
                tagsById={this.props.tagsById}
                createMode={false}
                tasksById={this.props.tasksById}
                createEvent={(event: Event) => {}}
                updateEvent={this.props.updateEvent}
                deleteEvent={this.props.deleteEvent}
            />
        </ModalComponent>
    }

    closeCreateEvent() {
        this.setState({
            showCreate: false,
            createEventTimestamp: null,
            createEventDurationSecs: null,
            createEventTask: null,
        });
    }

    createEvent(event: Event) {
        this.closeCreateEvent();
        this.props.createEvent(event);
    }

    renderCreateEvent() {
        if (!this.state.showCreate) {
            return;
        }

        const initialTags: Array<number> = [];
        if (this.props.selectedTag) {
            initialTags.push(this.props.selectedTag.id)
        }
        const initialTasks: Array<number> = [];
        if (this.state.createEventTask) {
            initialTasks.push(this.state.createEventTask.id);
            for (let tagId of this.state.createEventTask.tagIds) {
                if (!initialTags.length || tagId != initialTags[0]) {
                    initialTags.push(tagId)
                }
            }
        }

        return <ModalComponent cancelFunc={this.closeCreateEvent.bind(this)}>
            <EditEventComponent
                meUser={this.props.meUser}
                tagsById={this.props.tagsById}
                createMode={true}
                eventsById={this.props.eventsById}
                tasksById={this.props.tasksById}
                initialCreationTime={this.state.createEventTimestamp}
                initialDurationSecs={this.state.createEventDurationSecs}
                initialTags={initialTags}
                initialTasks={initialTasks}
                createEvent={this.createEvent.bind(this)}
                updateEvent={(event: Event) => {}}
                deleteEvent={(event: Event) => {}}
            />
        </ModalComponent>
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
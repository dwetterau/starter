import * as jQuery from "jquery";
import * as moment from "moment";
import * as React from "react";

import {EditEventComponent} from "./edit_event"
import {Event, User, TagsById, Tag, TasksById, Task, EventsById, getTagAndDescendantsRecursive} from "../../models"
import {Tokenizable, TokenizerComponent} from "../tokenizer";
import {EventComponent} from "./event";
import {ModalComponent} from "../lib/modal";

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
    tagIdToParents: {[tagId: number]: Array<number>}}

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

// TODO: Expand this so each day's column is only one cell
const GRANULARITY = 60 * 60; // Each cell is 60 minutes (unit in seconds)

// Used during new event creation to prevent "too short" of events. Not a hard limit.
const MIN_EVENT_DURATION = 15 * 60;

// The default size for a cell.
// TODO: Decouple this from granularity to have it keep reprsenting the size of each day.
const DEFAULT_CELL_HEIGHT = 50;

// Never use fewer than this many pixels for an event.
const MIN_EVENT_HEIGHT = 20;
const FAKE_EVENT_ID = -1;

interface EventRenderingInfo {
    index: number
    inRowWith: {[id: number]: boolean}
    biggestClique: Array<number>

    height: number
    top: number
    widthPercentage: number
    marginLeft: number
}

let lastScrollPosition = -1;

export class CalendarComponent extends React.Component<CalendarProps, CalendarState> {

    constructor(props: CalendarProps) {
        super(props);
        this.state = this.getState(props)
    }

    refreshLoopId = 0;

    static now(): moment.Moment {
        return moment()
    }

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
            draggingEvent: null,
            endDraggingEvent: null,
            tagIdToParents: CalendarComponent.computeTagIdToParent(props.tagsById),
        };
    }

    static computeTagIdToParent(tagsById: TagsById): {[tagId: number]: Array<number>} {
        let tagToParents = {};

        // First we need to sort all the tag ids. This makes sure when we add parents, we are doing
        // so in increasing tagID order (to break ties).
        let tagIds = [...Object.keys(tagsById)];
        tagIds.sort();

        for (let tagId of tagIds) {
            // Make sure every entry is in the map
            if (!tagToParents.hasOwnProperty(tagId)) {
                tagToParents[tagId] = [];
            }
            for (let childId of tagsById[tagId].childTagIds) {
                if (!tagToParents.hasOwnProperty(childId)) {
                    tagToParents[childId] = [];
                }
                tagToParents[childId].push(parseInt(tagId));
            }
        }

        return tagToParents;
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
        const container = document.getElementsByClassName("all-columns-container")[0];
        if (container) {
            container.addEventListener("scroll", () => {
                lastScrollPosition = container.scrollTop;
            });
            const cursor = document.getElementsByClassName("current-time-cursor");
            if (lastScrollPosition == -1 && cursor.length) {
                // Scroll the calendar view so that the current time is in the middle.
                const top = jQuery(cursor[0]).data("top");
                container.scrollTop = top - container.clientHeight / 2;
            } else {
                // Restore the old scroll we were at.
                container.scrollTop = lastScrollPosition
            }
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
            startDayMoment = this.computeClosestMonday(CalendarComponent.now())
        } else {
            startDayMoment = CalendarComponent.now().startOf("day")
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

            // No way around the "top is the same" case.
            if (Math.abs(top - idTopAndHeight.top) < eps) {
                return true
            }

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

            let aux: Array<{
                id: number,
                top: number,
                height: number,
            }> = [];
            column.forEach((eventId) => {
                let top = null;
                let height = null;
                let event = eventsById[eventId];
                let eps = 1e-6;
                if (event.startTime < columnStartTime) {
                    // event started on a previous day.
                    top = 0;
                } else {
                    // event must start somewhere during this day.
                    let percentage = (event.startTime - columnStartTime) / (86400 * 1000);
                    top = Math.round(percentage * view.cellHeight * (86400 / GRANULARITY) + eps);
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
                // Note: We want to floor this to make sure that we don't accidentally overlap.
                height = Math.floor(
                    Math.max(
                        Math.min(view.cellHeight, MIN_EVENT_HEIGHT),
                        (durationSecs / GRANULARITY) * view.cellHeight + eps,
                    )
                );

                // See if we need to shrink aux down
                while (aux.length && aux[aux.length - 1] == null) {
                    aux.pop()
                }

                // Base case for the initial element
                if (!aux.length) {
                    aux.push({id: event.id, height, top});
                    eventToRenderingInfo[this.getEventKey(event.id, columnIndex)] = {
                        index: 0,
                        inRowWith: {},
                        biggestClique: [event.id],
                        height: height,
                        top: top,
                        marginLeft: 0,
                        widthPercentage: 0,
                    };
                    return
                }

                let slotUsed = false;
                let inRowWith: {[id: number]: boolean} = {};
                // If this event doesn't overlap with an element in the array, replace it.
                // During the replace, we need to calculate what the max width was for the element.
                aux.forEach((idTopAndHeight, index) => {
                    if (!idTopAndHeight) {
                        return
                    }

                    if (!overlaps(idTopAndHeight, top)) {
                        // Doesn't overlap, will use this slot (if it's the first) and evict
                        if (!slotUsed) {
                            slotUsed = true;

                            // Replace out this element
                            aux[index] = {id: event.id, top, height};
                            eventToRenderingInfo[this.getEventKey(event.id, columnIndex)] = {
                                index,
                                inRowWith,
                                biggestClique: [event.id],
                                height: height,
                                top: top,
                                marginLeft: 0,
                                widthPercentage: 0,
                            }
                        } else {
                            aux[index] = null;
                        }
                    } else {
                        // We do overlap with this element, add it to our list and us to theirs
                        let otherRenderingInfo = eventToRenderingInfo[
                            this.getEventKey(idTopAndHeight.id, columnIndex)];
                        otherRenderingInfo.inRowWith[event.id] = true;
                        inRowWith[idTopAndHeight.id] = true
                    }
                });

                if (slotUsed) {
                    return;
                }

                // If this event overlaps with everything that is in aux, we must append
                // This also implies that nothing in aux is null
                eventToRenderingInfo[this.getEventKey(event.id, columnIndex)] = {
                    index: aux.length,
                    inRowWith: inRowWith,
                    biggestClique: [event.id],
                    height: height,
                    top: top,
                    marginLeft: 0,
                    widthPercentage: 0,
                };
                aux.push({id: event.id, top, height});
            });

            // This loop determines the maximally sized clique each event is a member of.
            let eventsToSize = {};
            let numToSize = 0;
            column.forEach((eventId) => {
                eventsToSize[eventId] = true;
                numToSize++;

                // Find the largest clique this event is in (remember to include itself).
                let ourInfo = eventToRenderingInfo[this.getEventKey(eventId, columnIndex)];
                let neighbors = [];
                for (let neighborId in ourInfo.inRowWith) {
                    neighbors.push(neighborId)
                }
                for (let subsetNumber = 1; subsetNumber < (1 << neighbors.length); subsetNumber++) {
                    let subset = [eventId];
                    for (let i = 0; i < neighbors.length; i++) {
                        if (subsetNumber & (1 << i)) {
                            subset.push(1 * neighbors[i]);
                        }
                    }

                    // Verify that it's a clique
                    let passed = true;
                    for (let neighbor of subset) {
                        let key = this.getEventKey(neighbor, columnIndex);
                        let edges = eventToRenderingInfo[key].inRowWith;
                        for (let otherNeighbor of subset) {
                            // We don't store the self edge because why.
                            if (otherNeighbor == neighbor) {
                                continue
                            }
                            if (!edges[otherNeighbor]) {
                                passed = false;
                                break;
                            }
                        }
                        if (!passed) {
                            break
                        }
                    }
                    if (!passed) {
                        continue;
                    }

                    if (subset.length > ourInfo.biggestClique.length) {
                        ourInfo.biggestClique = subset;
                    }
                }
            });

            // Sort by biggest cliques first
            column.sort((eventId1, eventId2) => {
                let info1 = eventToRenderingInfo[this.getEventKey(eventId1, columnIndex)];
                let info2 = eventToRenderingInfo[this.getEventKey(eventId2, columnIndex)];
                return info2.biggestClique.length - info1.biggestClique.length
            });

            // This iterates from largest cliques to smallest until all events have been sized.
            while (numToSize > 0) {
                for (let eventId of column) {
                    if (!eventsToSize[eventId]) {
                        continue
                    }

                    // This is the next one to size!
                    // First - see if any neighbors are already sized
                    let info = eventToRenderingInfo[this.getEventKey(eventId, columnIndex)];
                    let anySized = false;
                    for (let neighbor of info.biggestClique) {
                        if (!eventsToSize[neighbor]) {
                            anySized = true;
                            break
                        }
                    }

                    if (anySized) {
                        // Finish sizing our clique.
                        // Start from our index, look at the others in the clique, find
                        // connected regions, then size each of those using all available space.
                        info.biggestClique.sort((eventId1, eventId2) => {
                            let info1 = eventToRenderingInfo[this.getEventKey(eventId1, columnIndex)];
                            let info2 = eventToRenderingInfo[this.getEventKey(eventId2, columnIndex)];
                            return info1.index - info2.index;
                        });
                        let leftSizedInfo = null;
                        for (let i = 0; i < info.biggestClique.length; ) {
                            let curEventId = info.biggestClique[i];
                            if (!eventsToSize[curEventId]) {
                                leftSizedInfo = eventToRenderingInfo[this.getEventKey(curEventId, columnIndex)];
                                i++;
                                continue
                            }
                            let j = i + 1;
                            let rightSizedInfo = null;
                            for (; j < info.biggestClique.length; j++) {
                                let endEventId = info.biggestClique[j];
                                if (!eventsToSize[endEventId]) {
                                    rightSizedInfo = eventToRenderingInfo[this.getEventKey(endEventId, columnIndex)];
                                    break
                                }
                            }

                            let leftOffset = 0;
                            if (leftSizedInfo != null) {
                                leftOffset = leftSizedInfo.marginLeft + leftSizedInfo.widthPercentage;
                            }
                            let rightOffset = 100;
                            if (rightSizedInfo != null) {
                                rightOffset = rightSizedInfo.marginLeft;
                            }

                            // Now divide each element's space evenly
                            let unsizedWidth = j - i;
                            let width = (rightOffset - leftOffset) / unsizedWidth;
                            let marginLeft = leftOffset;
                            for (let k = i; k < j; k++) {
                                let key = this.getEventKey(info.biggestClique[k], columnIndex);
                                let renderingInfo = eventToRenderingInfo[key];
                                renderingInfo.marginLeft = marginLeft;
                                renderingInfo.widthPercentage = width;

                                delete eventsToSize[info.biggestClique[k]];
                                numToSize--;

                                marginLeft += width;
                            }
                            i = j;
                        }

                    } else {
                        // This is the easy case! Size everything in the clique
                        let width = info.biggestClique.length;
                        const widthPercentage = 100.0 / width;
                        for (let neighbor of info.biggestClique) {
                            let renderingInfo = eventToRenderingInfo[this.getEventKey(neighbor, columnIndex)];
                            const marginLeft = (100.0 / width) * renderingInfo.index;
                            renderingInfo.widthPercentage = Math.round(widthPercentage);
                            renderingInfo.marginLeft = Math.round(marginLeft);

                            delete eventsToSize[neighbor];
                            numToSize--;
                        }
                    }
                }
            }
        });
        return [columnList, eventToRenderingInfo];
    }

    onDoubleClick(event: Event) {
        this.setState({editingEvent: event});
    }

    computeTimestamp(day: string, index: number, percentage: number): number {
        let offset = index;
        // Let's do some buckets based on percentage
        if (percentage >= .125 && percentage < .375) {
            offset += GRANULARITY * .25
        } else if (percentage >= .375 && percentage < .625) {
            offset += GRANULARITY * .5
        } else if (percentage >= .625 && percentage < .875) {
            offset += GRANULARITY * .75
        } else if (percentage >= .875) {
            offset += GRANULARITY
        }

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

    getPercentageFromEvent(event: any) {
        let e = event;
        if (e.offsetY == undefined && window.event) {
            e = window.event;
        }
        if (!e.offsetY) {
            // TODO: Sort out what to do in these cases. I think it's debounce related.
            return 0
        }
        return e.offsetY / this.props.view.cellHeight
    }

    columnMouseDown(day: string, event: any) {
        let index = event.target.dataset.index * 1;
        const draggingStartTimestamp = this.computeTimestamp(day, index, this.getPercentageFromEvent(event));
        const draggingEndTimestamp = this.state.draggingStartTimestamp;
        this.setState({
            draggingStartTimestamp,
            createEventTimestamp: CalendarComponent.getCreateEventTimestamp(
                draggingStartTimestamp,
                draggingEndTimestamp,
            ),
        });

        event.preventDefault();
    }

    makePendingEvent(createEventTimestamp, createEventDurationSecs): Event {
        return {
            id: FAKE_EVENT_ID,
            name: "(untitled)",
            authorId: this.props.meUser.id,
            ownerId: this.props.meUser.id,
            tagIds: [],
            startTime: createEventTimestamp,
            durationSecs: createEventDurationSecs,
            taskIds: [],
        }
    }

    columnMouseMove(day: string, event: any) {
        if (!this.state.draggingStartTimestamp) {
            // No dragging was happening, nothing to do.
            return
        }
        let index = event.target.dataset.index * 1;
        let timestamp = this.computeTimestamp(day, index, this.getPercentageFromEvent(event));
        this.updatePendingCreateEvent(timestamp);
    }

    injectUpdatedEvent(event: Event): [Array<Array<number>>, {[eventId: string]: EventRenderingInfo}] {
        let events = {};
        for (let eventId in this.props.eventsById) {
            events[eventId] = this.props.eventsById[eventId];
        }
        events[event.id] = event;
        return CalendarComponent.divideAndSort(
            this.props.view,
            events,
            this.props.selectedTag,
            this.props.tagsById,
        );
    }

    updatePendingCreateEvent(timestamp: number) {
        const createEventTimestamp = CalendarComponent.getCreateEventTimestamp(
            this.state.draggingStartTimestamp,
            timestamp,
        );
        const createEventDurationSecs = CalendarComponent.getCreateEventDurationSecs(
            this.state.draggingStartTimestamp,
            timestamp,
        );

        // This re-build is pretty expensive, so skip all of it if we can.
        if (this.state.createEventTimestamp == createEventTimestamp &&
            this.state.createEventDurationSecs == createEventDurationSecs) {
            return
        }

        // Inject a fake event for the one we're creating.
        const [columns, eventToRenderingInfo] = this.injectUpdatedEvent(
            this.makePendingEvent(createEventTimestamp, createEventDurationSecs),
        );

        this.setState({
            createEventTimestamp: createEventTimestamp,
            createEventDurationSecs: createEventDurationSecs,
            columns: columns,
            eventToRenderingInfo: eventToRenderingInfo,
        });
    }

    columnMouseUp(day: string, event: any) {
        if (!this.state.draggingStartTimestamp) {
            // No dragging was happening, nothing to do.
            return
        }
        let index = event.target.dataset.index * 1;
        let timestamp = this.computeTimestamp(day, index,this.getPercentageFromEvent(event) );
        this.finishPendingCreateEvent(timestamp);
    }

    finishPendingCreateEvent(timestamp: number) {
        this.setState({
            draggingStartTimestamp: null,
            createEventTimestamp: CalendarComponent.getCreateEventTimestamp(
                this.state.draggingStartTimestamp,
                timestamp,
            ),
            createEventDurationSecs: CalendarComponent.getCreateEventDurationSecs(
                this.state.draggingStartTimestamp,
                timestamp,
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
        duration = Math.max(duration, MIN_EVENT_DURATION);
        return duration;
    }

    onDrop(day: string, index: number, e: any, percentage: number) {
        if (percentage == undefined) {
            percentage = this.getPercentageFromEvent(e);
        }
        let timestamp = this.computeTimestamp(day, index, percentage);
        if (this.state.draggingEvent) {
            // Update the event with the new timestamp
            let eventToUpdate = this.state.draggingEvent;
            eventToUpdate.startTime = timestamp;
            this.props.updateEvent(eventToUpdate);
        } else if (this.state.endDraggingEvent) {
            let newDuration = timestamp - this.state.endDraggingEvent.startTime;
            newDuration = Math.max(
                Math.round(newDuration / 1000),
                MIN_EVENT_DURATION,
            );

            let eventToUpdate = this.state.endDraggingEvent;
            eventToUpdate.durationSecs = newDuration;
            this.props.updateEvent(eventToUpdate);
        } else if (this.state.draggingStartTimestamp) {
            this.finishPendingCreateEvent(timestamp);
        } else {
            // No event was being dragged
            return
        }
    }

    getDayAndIndexUnderneathEvent(event: any, callback: (day: string, index: number, event: any, percentage: number) => void) {
        const xPos = event.clientX;
        const yPos = event.clientY;

        // Hide the element
        jQuery(event.currentTarget).hide();
        const dropTargetBelow = jQuery(document.elementFromPoint(xPos, yPos));
        if (dropTargetBelow.prop("tagName") == "TD") {
            // Great, we found a cell that we can actually finish dropping into
            const data = dropTargetBelow.data();
            const percentage = (yPos - dropTargetBelow.offset().top) / this.props.view.cellHeight;
            callback(data.day, data.index, null, percentage);
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
        this.setState({draggingEvent: Event.clone(event)});
        dragEvent.dataTransfer.setData('text/html', null);
        dragEvent.dataTransfer.setDragImage(new Image(), 0, 0);
    }

    onEventEndDragStart(event: Event, dragEvent: DragEvent) {
        if (this.state.endDraggingEvent || this.state.draggingEvent) {
            throw Error("Already dragging an event...");
        }

        this.setState({endDraggingEvent: Event.clone(event)});
        dragEvent.dataTransfer.setData('text/html', null);
    }

    onDragOver(day: string, index: number, event: any, percentage: number) {
        // Watch out: This function is abused and needs refactoring. Event might be undefined,
        // index might be -1. Not at the same time though.
        if (event) {
            event.preventDefault();
        }
        if (index == -1) {
            index = event.target.dataset.index * 1;
            percentage = this.getPercentageFromEvent(event);
        }
        let timestamp = this.computeTimestamp(day, index, percentage);
        if (this.state.draggingEvent) {
            if (this.state.draggingEvent.startTime == timestamp) {
                return
            }
            let toModify = Event.clone(this.state.draggingEvent);
            toModify.startTime = timestamp;
            const [columns, eventToRenderingInfo] = this.injectUpdatedEvent(toModify);
            this.setState({
                columns,
                eventToRenderingInfo,
                draggingEvent: toModify,
            });
        } else if (this.state.endDraggingEvent) {
            let newDuration = timestamp - this.state.endDraggingEvent.startTime;
            newDuration = Math.max(
                Math.round(newDuration / 1000),
                MIN_EVENT_DURATION,
            );
            if (newDuration == this.state.endDraggingEvent.durationSecs) {
                return;
            }
            let toModify = Event.clone(this.state.endDraggingEvent);
            toModify.durationSecs = newDuration;
            const [columns, eventToRenderingInfo] = this.injectUpdatedEvent(toModify);
            this.setState({
                columns,
                eventToRenderingInfo,
                endDraggingEvent: toModify,
            });
        } else if (this.state.draggingStartTimestamp) {
            this.updatePendingCreateEvent(timestamp);
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
            const now = CalendarComponent.now();
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
            let className = "";
            if (day == "times") {
                let timeHeader = "";
                if (index % GRANULARITY == 0) {
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
                onMouseMove={this.columnMouseMove.bind(this, day)}
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
        const currentTime = CalendarComponent.now().unix() * 1000;
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

    tagColor(tag: Tag): string {
        // Now see if any tag has a color. We do this by stopping at the first color we encounter
        // while doing the following walk:
        // 1. See if the tag has a color.
        // 2. Traverse up to the root.
        // 3. If a tag has multiple parents, traverse the lower-id one first.
        if (tag.color.length > 0) {
            return tag.color
        }

        for (let parentId of this.state.tagIdToParents[tag.id]) {
            let parent = this.props.tagsById[parentId];
            let parentColor = this.tagColor(parent);
            if (parentColor.length > 0) {
                return parentColor
            }
        }

        return "";
    }

    computeColor(event: Event) {
        for (let tagId of event.tagIds) {
            let tag = this.props.tagsById[tagId];
            let tagColor = this.tagColor(tag);
            if (tagColor.length > 0) {
                return tagColor
            }
        }
         // Default of nice blue
        return "#6495ed";
    }

    getEvent(eventId: number) {
        if (eventId == FAKE_EVENT_ID) {
            return this.makePendingEvent(
                this.state.createEventTimestamp,
                this.state.createEventDurationSecs,
            )
        }
        if (this.state.draggingEvent && this.state.draggingEvent.id == eventId) {
            return this.state.draggingEvent;
        }
        if (this.state.endDraggingEvent && this.state.endDraggingEvent.id == eventId) {
            return this.state.endDraggingEvent;
        }
        return this.props.eventsById[eventId];
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

                // We subtract 2 from the height purely for stylistic reasons.
                const style = {
                    "height": `${renderingInfo.height}px`,
                    "maxHeight": `${renderingInfo.height}px`,
                    "top": `${renderingInfo.top}px`,
                    "marginLeft": `${renderingInfo.marginLeft}%`,
                    "width": `${renderingInfo.widthPercentage}%`,
                };
                let event = this.getEvent(eventId);
                return (
                    <div
                        className="rendered-event-container"
                        key={eventId}
                        style={style}
                        onDrop={this.onDropPassThrough.bind(this)}
                        onDragOver={this.onDragOverPassThrough.bind(this)}
                        onMouseMove={this.onDragOverPassThrough.bind(this)}
                        onMouseUp={this.onDropPassThrough.bind(this)}
                    >
                        <div
                            className="rendered-event card"
                            draggable={true}
                            onDragStart={this.onDragStart.bind(this, event)}
                            onDoubleClick={this.onDoubleClick.bind(this, event)}
                            style={{"background": this.computeColor(event)}}
                        >
                            <EventComponent
                                event={event}
                                tagsById={this.props.tagsById}
                            />
                        </div>
                        <div className="draggable-event-end"
                             draggable={true}
                             onDragStart={this.onEventEndDragStart.bind(this, event)}
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
                    <div className="column-header -times" />
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
        // Re-generate the events to remove the pending one.
        const [columns, eventToRenderingInfo] = CalendarComponent.divideAndSort(
            this.props.view,
            this.props.eventsById,
            this.props.selectedTag,
            this.props.tagsById,
        );

        this.setState({
            showCreate: false,
            createEventTimestamp: null,
            createEventDurationSecs: null,
            createEventTask: null,
            columns: columns,
            eventToRenderingInfo: eventToRenderingInfo,
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
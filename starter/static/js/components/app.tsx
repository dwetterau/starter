import * as jQuery from "jquery";
import * as React from "react";
import {Router, Route, browserHistory} from "react-router"

import {Event, Tag, Task, User, TagsById, EventsById, TasksById} from "../models";
import {TagGraphComponent} from "./tag/tag_graph";
import {TaskBoardComponent} from "./task/task_board"
import {CalendarComponent, CalendarViewType} from "./event/calendar";
import {AppHeader} from "./app_header";
import {NotifierComponent} from "./notifier";

export interface AppProps {
    meUser: User,
    tasks: Array<Task>,
    events: Array<Event>,
    tags: Array<Tag>,
}
export interface AppState {
    tasks: Array<Task>,
    events: Array<Event>,
    tags: Array<Tag>,
    tagsById: TagsById,
    eventsById: EventsById,
    tasksById: TasksById,

    signalCreateEventWithTask?: Task,
    signalEndEventWithTask?: Task,
}

export enum AppViewMode {
    mergedView,
    taskView,
    eventView,
    tagView,
}

export class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
        const newState = {
            tasks: props.tasks,
            events: props.events,
            tags: props.tags,
            tagsById: {},
            eventsById: {},
            tasksById: {},
        };
        App.updateTagsById(newState);
        App.updateEventsById(newState);
        App.updateTasksById(newState);
        this.state = newState;
    }

    static updateTasksById(state: AppState) {
        const tasksById: TasksById = {};
        for (let task of state.tasks) {
            tasksById[task.id] = task;
        }
        state.tasksById = tasksById;
    }

    createTask(task: Task) {
        delete task["id"];
        jQuery.post('/api/1/task/create', task, (newTaskJson: string) => {
            this.state.tasks.push(JSON.parse(newTaskJson));
            App.updateTasksById(this.state);
            this.setState(this.state)
        });
    }

    updateTask(task: Task) {
        let oldIds = task.eventIds;
        delete task['eventIds'];
        jQuery.post('/api/1/task/update', task, (updatedTaskJson: string) => {
            let updatedTask: Task = JSON.parse(updatedTaskJson);
            this.state.tasks = this.state.tasks.map((task: Task) => {
                if (task.id == updatedTask.id) {
                    return updatedTask
                } else {
                    return task
                }
            });
            App.updateTasksById(this.state);
            this.setState(this.state);
        });
        task.eventIds = oldIds;
    }

    deleteTask(task: Task) {
        jQuery.post('/api/1/task/delete', {id: task.id}, (deletedTaskJson: string) => {
            const deletedTaskId = JSON.parse(deletedTaskJson).id;
            this.state.tasks = this.state.tasks.filter((task: Task) => {
                return task.id != deletedTaskId;
            });
            this.setState(this.state);
        })
    }

    static updateEventsById(state: AppState) {
        const eventsById: EventsById = {};
        for (let event of state.events) {
            eventsById[event.id] = event;
        }
        state.eventsById = eventsById;
    }

    updateTaskToEventsAfterNewEvent(newEvent: Event) {
        // When an event is updated, we need to make sure that all the associated tasks are also
        // updated
        let oldTaskMap = {};
        for (let task of this.state.tasks) {
            for (let eventId of task.eventIds) {
                if (eventId == newEvent.id) {
                    oldTaskMap[task.id] = true;
                }
            }
        }

        let newTaskMap = {};
        for (let taskId of newEvent.taskIds) {
            newTaskMap[taskId] = true;

            if (!oldTaskMap[taskId]) {
                // This task just got added to this event. Add the eventId to the task
                this.state.tasksById[taskId].eventIds.push(newEvent.id);
            }
        }

        for (let taskId in oldTaskMap) {
            if (!newTaskMap[taskId]) {
                // This tag no longer has this event, update it's list of events
                this.state.tasksById[taskId].eventIds = (
                    this.state.tasksById[taskId].eventIds.filter((eventId) => {
                        return eventId != newEvent.id
                    })
                );
            }
        }
    }

    createEvent(event: Event) {
        delete event["id"];
        jQuery.post('/api/1/event/create', event, (newEventJson: string) => {
            let newEvent = JSON.parse(newEventJson);
            this.state.events.push(newEvent);
            App.updateEventsById(this.state);
            this.updateTaskToEventsAfterNewEvent(newEvent);
            this.setState(this.state)
        });
    }

    updateEvent(event: Event) {
        jQuery.post('/api/1/event/update', event, (updatedEventJson: string) => {
            let updatedEvent: Event = JSON.parse(updatedEventJson);
            this.state.events = this.state.events.map((event: Event) => {
                if (event.id == updatedEvent.id) {
                    return updatedEvent
                } else {
                    return event
                }
            });
            App.updateEventsById(this.state);
            this.updateTaskToEventsAfterNewEvent(updatedEvent);
            this.setState(this.state);
        });
    }

    deleteEvent(event: Event) {
        jQuery.post('/api/1/event/delete', {id: event.id}, (deletedEventJson: string) => {
            const deletedEventId = JSON.parse(deletedEventJson).id;
            this.state.events = this.state.events.filter((event: Event) => {
                return event.id != deletedEventId;
            });
            this.setState(this.state);
        })
    }

    static updateTagsById(state: AppState) {
        const tagsById: TagsById = {};
        for (let tag of state.tags) {
            tagsById[tag.id] = tag;
        }
        state.tagsById = tagsById;
    }

    createTag(tag: Tag) {
        delete tag["id"];
        jQuery.post('/api/1/tag/create', tag, (newTagJson: string) => {
            this.state.tags.push(JSON.parse(newTagJson));
            App.updateTagsById(this.state);
            this.setState(this.state);
        })
    }

    updateTag(tag: Tag) {
        jQuery.post('/api/1/tag/update', tag, (updatedTagJson: string) => {
            let updatedTag: Tag = JSON.parse(updatedTagJson);
            this.state.tags = this.state.tags.map((tag: Tag) => {
                if (tag.id == updatedTag.id) {
                    return updatedTag;
                } else {
                    return tag;
                }
            });
            App.updateTagsById(this.state);
            this.setState(this.state);
        })
    }

    deleteTag(tag: Tag) {
        // TODO: Filter out all tags and children or something
    }

    renderNotifier() {
        return <NotifierComponent
            tasks={this.state.tasks}
            events={this.state.events}
        />
    }

    renderMergedView() {
        return <div className="merged-container">
            <div className="main-pane">
                <div className="merged-task-container">
                    {this.renderTaskBoard(true)}
                </div>
            </div>
            <div className="right-pane">
                <div className="merged-calendar-container">
                    {this.renderCalendar(CalendarViewType.day, true)}
                </div>
            </div>
        </div>
    }

    renderTaskBoard(allowCalendarCoordination: boolean) {
        let maybeCreateEvent = (t: Task) => void {};
        let maybeEndEvent = (t: Task) => void {};

        if (allowCalendarCoordination) {
            maybeCreateEvent = (t: Task) => {
                this.state.signalCreateEventWithTask = t;
                this.setState(this.state)
            };
            maybeEndEvent = (t: Task) => {
                this.state.signalEndEventWithTask = t;
                this.setState(this.state)
            };
        }

        return <TaskBoardComponent
            meUser={this.props.meUser}
            tasks={this.state.tasks}
            tagsById={this.state.tagsById}
            eventsById={this.state.eventsById}
            createTask={this.createTask.bind(this)}
            updateTask={this.updateTask.bind(this)}
            deleteTask={this.deleteTask.bind(this)}
            maybeCreateEvent={maybeCreateEvent}
            maybeEndEvent={maybeEndEvent}
        />
    }

    renderCalendar(viewType, simpleOptions) {
        let maybeCreateEventWithTask = null;
        let maybeEndEventWithTask = null;

        if (this.state.signalCreateEventWithTask) {
            maybeCreateEventWithTask = this.state.signalCreateEventWithTask;
            this.state.signalCreateEventWithTask = null;
        }

        if (this.state.signalEndEventWithTask) {
            maybeEndEventWithTask = this.state.signalEndEventWithTask;
            this.state.signalEndEventWithTask = null;
        }

        return <CalendarComponent
            meUser={this.props.meUser}
            events={this.state.events}
            tagsById={this.state.tagsById}
            tasksById={this.state.tasksById}
            initialViewType={viewType}
            simpleOptions={simpleOptions}
            createEvent={this.createEvent.bind(this)}
            updateEvent={this.updateEvent.bind(this)}
            deleteEvent={this.deleteEvent.bind(this)}
            maybeCreateEventWithTask={maybeCreateEventWithTask}
            maybeEndEventWithTask={maybeEndEventWithTask}
        />
    }

    renderTagGraph() {
        return <TagGraphComponent
            meUser={this.props.meUser}
            tagsById={this.state.tagsById}
            createTag={this.createTag.bind(this)}
            updateTag={this.updateTag.bind(this)}
            deleteTag={this.deleteTag.bind(this)}
        />
    }

    renderPageContainer(viewMode: AppViewMode, getBoardFn) {
        return <div>
            {this.renderNotifier()}
            <AppHeader meUser={this.props.meUser} viewMode={viewMode} />
            <div className="board-container">
                {getBoardFn()}
            </div>
        </div>
    };

    render() {
        let getMergedView = () => {
           return this.renderPageContainer(
               AppViewMode.mergedView,
               this.renderMergedView.bind(this),
           )
        };
        let getTaskBoard = () => {
            return this.renderPageContainer(
                AppViewMode.taskView,
                this.renderTaskBoard.bind(this, false),
            )
        };
        let getCalendarWeek = (viewType) => {
            return this.renderPageContainer(
                AppViewMode.eventView,
                this.renderCalendar.bind(this, viewType, false)
            )
        };
        let getTagGraph = () => {
            return this.renderPageContainer(
                AppViewMode.tagView,
                this.renderTagGraph.bind(this),
            )
        };

        return <div>
            <Router history={browserHistory}>
                <Route path="/" component={getMergedView} />
                <Route path="/tasks" component={getTaskBoard} />
                <Route path="/cal" component={getCalendarWeek.bind(this, CalendarViewType.week)} />
                <Route
                    path="/cal/week"
                    component={getCalendarWeek.bind(this, CalendarViewType.week)}
                />
                <Route
                    path="/cal/day"
                    component={getCalendarWeek.bind(this, CalendarViewType.day)}
                />
                <Route path="/tags" component={getTagGraph} />
            </Router>
        </div>
    }
}

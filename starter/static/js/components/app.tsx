import * as jQuery from "jquery";
import * as React from "react";
import {Router, Route, browserHistory} from "react-router"

import {Event, Tag, Task, User, TagsById, EventsById} from "../models";
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
        };
        App.updateTagsById(newState);
        App.updateEventsById(newState);
        this.state = newState;
    }

    createTask(task: Task) {
        delete task["id"];
        jQuery.post('/api/1/task/create', task, (newTaskJson: string) => {
            this.state.tasks.push(JSON.parse(newTaskJson));
            this.setState(this.state)
        });
    }

    updateTask(task: Task) {
        jQuery.post('/api/1/task/update', task, (updatedTaskJson: string) => {
            let updatedTask: Task = JSON.parse(updatedTaskJson);
            this.state.tasks = this.state.tasks.map((task: Task) => {
                if (task.id == updatedTask.id) {
                    return updatedTask
                } else {
                    return task
                }
            });
            this.setState(this.state);
        });
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

    createEvent(event: Event) {
        delete event["id"];
        jQuery.post('/api/1/event/create', event, (newEventJson: string) => {
            this.state.events.push(JSON.parse(newEventJson));
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

    static updateEventsById(state: AppState) {
        const eventsById: EventsById = {};
        for (let event of state.events) {
            eventsById[event.id] = event;
        }
        state.eventsById = eventsById;
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
                    {this.renderTaskBoard()}
                </div>
            </div>
            <div className="right-pane">
                <div className="merged-calendar-container">
                    {this.renderCalendar(CalendarViewType.day, true)}
                </div>
            </div>
        </div>
    }

    renderTaskBoard() {
        return <TaskBoardComponent
            meUser={this.props.meUser}
            tasks={this.state.tasks}
            tagsById={this.state.tagsById}
            eventsById={this.state.eventsById}
            createTask={this.createTask.bind(this)}
            updateTask={this.updateTask.bind(this)}
            deleteTask={this.deleteTask.bind(this)}
        />
    }

    renderCalendar(viewType, simpleOptions) {
        return <CalendarComponent
            meUser={this.props.meUser}
            events={this.state.events}
            tagsById={this.state.tagsById}
            tasks={this.state.tasks}
            initialViewType={viewType}
            simpleOptions={simpleOptions}
            createEvent={this.createEvent.bind(this)}
            updateEvent={this.updateEvent.bind(this)}
            deleteEvent={this.deleteEvent.bind(this)}
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
                this.renderTaskBoard.bind(this),
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

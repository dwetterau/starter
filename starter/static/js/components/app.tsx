import * as React from "react";
import * as jQuery from "jquery";

import {Event, Tag, Task, User, TagsById} from "../models";
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
    viewMode: AppViewMode,
    calendarDayView?: boolean,
}
export interface AppState {
    tasks: Array<Task>,
    events: Array<Event>,
    tags: Array<Tag>,
    tagsById: TagsById,
}

export enum AppViewMode {
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
        };
        App.updateTagsById(newState);
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

    renderTaskBoard() {
        return <TaskBoardComponent
            meUser={this.props.meUser}
            tasks={this.state.tasks}
            tagsById={this.state.tagsById}
            createTask={this.createTask.bind(this)}
            updateTask={this.updateTask.bind(this)}
            deleteTask={this.deleteTask.bind(this)}
        />
    }

    renderCalendar() {
        let viewType = CalendarViewType.week;
        if (this.props.calendarDayView) {
            viewType = CalendarViewType.day;
        }
        return <CalendarComponent
            meUser={this.props.meUser}
            events={this.state.events}
            tagsById={this.state.tagsById}
            tasks={this.state.tasks}
            initialViewType={viewType}
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

    renderBoard() {
        if (this.props.viewMode == AppViewMode.taskView) {
            return <div className="board-container">
                {this.renderTaskBoard()}
            </div>
        } else if (this.props.viewMode == AppViewMode.eventView) {
            return <div className="calendar-container">
                {this.renderCalendar()}
            </div>
        } else if (this.props.viewMode == AppViewMode.tagView) {
            return <div className="tag-graph-container">
                {this.renderTagGraph()}
            </div>
        }
    }

    render() {
        return <div>
            <AppHeader meUser={this.props.meUser} viewMode={this.props.viewMode} />
            {this.renderNotifier()}
            {this.renderBoard()}
        </div>
    }
}

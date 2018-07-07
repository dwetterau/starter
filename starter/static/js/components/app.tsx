import * as jQuery from "jquery";
import * as React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom"

import {
    Event, Tag, Task, User, TagsById, EventsById, TasksById, NotesById, Note,
    CapturesById, Capture
} from "../models";
import {TagGraphComponent} from "./tag/tag_graph";
import {TaskBoardComponent} from "./task/task_board"
import {CalendarComponent, CalendarViewType} from "./event/calendar";
import {AppHeader} from "./app_header";
import {
    signalDisplayTaskInfo, signalBeginEditingTask, signalDisplayTagInfo,
} from "../events";
import {TaskDetailComponent} from "./task/task_detail";
import {TagDetailComponent} from "./tag/tag_detail";
import {NoteBoardComponent} from "./notes/note_board";
import {CaptureListComponent} from "./capture/capture_list";

export interface AppProps {
    meUser: User,
    tasks: Array<Task>,
    events: Array<Event>,
    tags: Array<Tag>,
    notes: Array<Note>,
    captures: Array<Capture>,
}

interface DetailInfo {
    tagId?: number,
    taskId?: number,
}

interface ApiError {
    status: number
    responseText: string
}

export interface AppState {
    tasks: Array<Task>
    events: Array<Event>
    tags: Array<Tag>
    notes: Array<Note>
    captures: Array<Capture>
    tagsById: TagsById
    eventsById: EventsById
    tasksById: TasksById
    detailInfo: DetailInfo
    notesById: NotesById
    capturesById: CapturesById
}

export enum AppViewMode {
    mergedView,
    planView,
    taskView,
    eventView,
    tagView,
    noteView,
}

export class App extends React.Component<AppProps, AppState> {

    constructor(props: AppProps) {
        super(props);
        const newState: AppState = {
            tasks: props.tasks,
            events: props.events,
            tags: props.tags,
            notes: props.notes,
            captures: props.captures,
            tagsById: {},
            eventsById: {},
            tasksById: {},
            detailInfo: {},
            notesById: {},
            capturesById: {},
        };
        App.updateTagsById(newState);
        App.updateEventsById(newState);
        App.updateTasksById(newState);
        App.updateNotesById(newState);
        App.updateCapturesById(newState);
        this.state = newState;
    }

    // Global listener registration
    _handleDisplayTaskInfo = null;
    _handleDisplayTagInfo = null;
    componentDidMount() {
        this._handleDisplayTaskInfo = this.handleDisplayTaskInfo.bind(this);
        document.addEventListener(signalDisplayTaskInfo, this._handleDisplayTaskInfo);

        this._handleDisplayTagInfo = this.handleDisplayTagInfo.bind(this);
        document.addEventListener(signalDisplayTagInfo, this._handleDisplayTagInfo);
    }

    componentWillUnmount() {
        document.removeEventListener(signalDisplayTaskInfo, this._handleDisplayTaskInfo);
        this._handleDisplayTaskInfo = null;

        document.removeEventListener(signalDisplayTagInfo, this._handleDisplayTagInfo);
        this._handleDisplayTagInfo = null;
    }

    handleDisplayTaskInfo(e: CustomEvent) {
        // Sets the task identified by the event to be selected
        this.setState({
            detailInfo: {
                taskId: e.detail,
                tagId: null,
            }
        });
    }

    handleDisplayTagInfo(e: CustomEvent) {
        // Sets the tag identified by the event to be selected
        let tagId = e.detail;
        this.state.detailInfo = {
            taskId: null,
            tagId: tagId,
        };

        this.setState(this.state);
    }

    _apiError: ApiError = null;
    handleApiError(apiError: ApiError) {
        // This doesn't use react for any rendering because setting the state clears out
        // the editors :(
        // TODO: What if we haven't cleared the last one?
        this._apiError = apiError;

        // Clear out the error in a few seconds
        setTimeout(() => {
            if (!this._apiError) {
                return
            }
            if (apiError.responseText == this._apiError.responseText) {
                this._apiError=  null;
                jQuery("#toast-container").addClass("hidden");
            }
        }, 4000);

        jQuery("#toast-container").html(
            `${this._apiError.status} - ${this._apiError.responseText}`
        ).removeClass("hidden");
    }

    // API-style methods for updating global state.
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
        }).fail(this.handleApiError.bind(this));
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
        }).fail(this.handleApiError.bind(this));
        task.eventIds = oldIds;
    }

    deleteTask(task: Task) {
        jQuery.post('/api/1/task/delete', {id: task.id}, (deletedTaskJson: string) => {
            const deletedTaskId = JSON.parse(deletedTaskJson).id;
            this.state.tasks = this.state.tasks.filter((task: Task) => {
                return task.id != deletedTaskId;
            });
            App.updateTasksById(this.state);
            this.setState(this.state);
        }).fail(this.handleApiError.bind(this));
    }

    static updateEventsById(state: AppState) {
        const eventsById: EventsById = {};
        for (let event of state.events) {
            eventsById[event.id] = event;
        }
        state.eventsById = eventsById;
    }

    updateTaskToEventsAfterEventChange(changedEvent: Event, isDelete: boolean) {
        // When an event is updated, we need to make sure that all the associated tasks are also
        // updated
        let oldTaskMap = {};
        for (let task of this.state.tasks) {
            for (let eventId of task.eventIds) {
                if (eventId == changedEvent.id) {
                    oldTaskMap[task.id] = true;
                }
            }
        }

        let newTaskMap = {};
        for (let taskId of changedEvent.taskIds) {
            // Only add the task to the newTask map if this isn't a delete.
            // All delete cases are handled in the next loop over oldTaskMap.
            if (!isDelete) {
                newTaskMap[taskId] = true;

                if (!oldTaskMap[taskId]) {
                    // This task just got added to this event. Add the eventId to the task
                    this.state.tasksById[taskId].eventIds.push(changedEvent.id);
                }
            }
        }

        for (let taskId in oldTaskMap) {
            if (!newTaskMap[taskId]) {
                // This tag no longer has this event, update it's list of events
                this.state.tasksById[taskId].eventIds = (
                    this.state.tasksById[taskId].eventIds.filter((eventId) => {
                        return eventId != changedEvent.id
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
            this.updateTaskToEventsAfterEventChange(newEvent, false);
            this.setState(this.state)
        }).fail(this.handleApiError.bind(this));
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
            this.updateTaskToEventsAfterEventChange(updatedEvent, false);
            this.setState(this.state);
        }).fail(this.handleApiError.bind(this));
    }

    deleteEvent(event: Event) {
        jQuery.post('/api/1/event/delete', {id: event.id}, (deletedEventJson: string) => {
            const deletedEventId = JSON.parse(deletedEventJson).id;
            this.state.events = this.state.events.filter((event: Event) => {
                return event.id != deletedEventId;
            });
            App.updateEventsById(this.state);
            this.updateTaskToEventsAfterEventChange(event, true);
            this.setState(this.state);
        }).fail(this.handleApiError.bind(this))
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
        }).fail(this.handleApiError.bind(this))
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
        }).fail(this.handleApiError.bind(this))
    }

    deleteTag(tag: Tag) {
        // TODO: Filter out all tags and children or something
    }

    static updateNotesById(state: AppState) {
        const notesById:  NotesById = {};
        for (let note of state.notes) {
            notesById[note.id] = note;
        }
        state.notesById = notesById;
    }

    createNote(note: Note) {
        delete note["id"];
        jQuery.post('/api/1/note/create', note, (newNoteJson: string) => {
            this.state.notes.push(JSON.parse(newNoteJson));
            App.updateNotesById(this.state);
            this.setState(this.state)
        }).fail(this.handleApiError.bind(this));
    }

    updateNote(note: Note) {
        jQuery.post('/api/1/note/update', note, (updatedNoteJson: string) => {
            let updatedNote: Note = JSON.parse(updatedNoteJson);
            this.state.notes = this.state.notes.map((note: Note) => {
                if (note.id == updatedNote.id) {
                    return updatedNote
                } else {
                    return note
                }
            });
            App.updateNotesById(this.state);
            this.setState(this.state);
        }).fail(this.handleApiError.bind(this));
    }

    deleteNote(note: Note) {
        jQuery.post('/api/1/note/delete', {id: note.id}, (deletedNoteJson: string) => {
            const deletedNoteId = JSON.parse(deletedNoteJson).id;
            this.state.notes = this.state.notes.filter((note: Note) => {
                return note.id != deletedNoteId;
            });
            App.updateNotesById(this.state);
            this.setState(this.state);
        }).fail(this.handleApiError.bind(this))
    }

    static updateCapturesById(state: AppState) {
        const capturesById:  CapturesById = {};
        for (let capture of state.captures) {
            capturesById[capture.id] = capture;
        }
        state.capturesById = capturesById;
    }

    createCapture(capture: Capture) {
        delete capture["id"];
        jQuery.post('/api/1/capture/create', capture, (newCaptureJson: string) => {
            this.state.captures.push(JSON.parse(newCaptureJson));
            App.updateCapturesById(this.state);
            this.setState(this.state)
        }).fail(this.handleApiError.bind(this));
    }

    deleteCapture(capture: Capture) {
        jQuery.post('/api/1/capture/delete', {id: capture.id}, (deletedCaptureJson: string) => {
            const deletedCaptureId = JSON.parse(deletedCaptureJson).id;
            this.state.captures = this.state.captures.filter((capture: Capture) => {
                return capture.id != deletedCaptureId;
            });
            App.updateCapturesById(this.state);
            this.setState(this.state);
        }).fail(this.handleApiError.bind(this))
    }

    // Inline handlers for detail changes
    beginEditingSelectedTask() {
        if (!this.state.detailInfo.taskId) {
            // No task to start editing.
            return
        }
        let event = new CustomEvent(
            signalBeginEditingTask,
            {'detail': this.state.detailInfo.taskId},
        );
        document.dispatchEvent(event)
    }

    closeDetail() {
        this.state.detailInfo = {};
        this.setState(this.state);
    }

    renderDetail() {
        if (this.state.detailInfo.taskId) {
            let task = this.state.tasksById[this.state.detailInfo.taskId];
            if (!task) {
                console.error("Task not found to show detail for...");
                return
            }

            return <TaskDetailComponent
                task={task}
                eventsById={this.state.eventsById}
                closeCallback={this.closeDetail.bind(this)}
                editCallback={this.beginEditingSelectedTask.bind(this)}
            />
        } else if (this.state.detailInfo.tagId) {
            let tag = this.state.tagsById[this.state.detailInfo.tagId];
            if (!tag) {
                console.error("Tag not found to show detail for...");
                return
            }

            return <TagDetailComponent
                tag={tag}
                eventsById={this.state.eventsById}
                tagsById={this.state.tagsById}
                closeCallback={this.closeDetail.bind(this)}
            />
        }
    }

    renderToasts() {
        return <div id="toast-container" className="hidden" />
    }

    renderMergedView(tagName) {
        return <div className="merged-container">
            <div className="main-pane">
                <div className="merged-task-container">
                    {this.renderTaskBoard(tagName)}
                </div>
                {this.renderDetail()}
            </div>
            <div className="right-pane">
                <div className="merged-capture-container">
                    {this.renderCaptures()}
                </div>
            </div>
        </div>
    }

    renderPlanView(tagName) {
        return <div className="merged-container">
             <div className="main-pane">
                <div className="merged-task-container">
                    {this.renderTaskBoard(tagName)}
                </div>
                {this.renderDetail()}
            </div>
            <div className="right-pane">
                <div className="merged-calendar-container">
                    {this.renderCalendar(CalendarViewType.day, true)}
                </div>
            </div>
        </div>
    }

    renderTaskBoard(tagName) {
        return <TaskBoardComponent
            meUser={this.props.meUser}
            tasksById={this.state.tasksById}
            initialTagName={tagName}
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
            eventsById={this.state.eventsById}
            tagsById={this.state.tagsById}
            tasksById={this.state.tasksById}
            initialViewType={viewType}
            simpleOptions={simpleOptions}
            createEvent={this.createEvent.bind(this)}
            updateEvent={this.updateEvent.bind(this)}
            deleteEvent={this.deleteEvent.bind(this)}
        />
    }

    renderCaptures() {
        return <CaptureListComponent
            meUser={this.props.meUser}
            capturesById={this.state.capturesById}
            createCapture={this.createCapture.bind(this)}
            deleteCapture={this.deleteCapture.bind(this)}
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

    renderNotes() {
        return <NoteBoardComponent
            meUser={this.props.meUser}
            notesById={this.state.notesById}
            tagsById={this.state.tagsById}
            createNote={this.createNote.bind(this)}
            updateNote={this.updateNote.bind(this)}
            deleteNote={this.deleteNote.bind(this)}
        />
    }

    renderPageContainer(viewMode: AppViewMode, getBoardFn) {
        return <div>
            <AppHeader meUser={this.props.meUser} viewMode={viewMode} />
            <div className="board-container">
                {getBoardFn()}
            </div>
            {this.renderToasts()}
        </div>
    };

    render() {
        let getMergedView = () => {
           return this.renderPageContainer(
               AppViewMode.mergedView,
               this.renderMergedView.bind(this),
           )
        };
        let getMergedWithTag = (somethingWithParams: any) => {
            return this.renderPageContainer(
                AppViewMode.mergedView,
                this.renderMergedView.bind(this, somethingWithParams.match.params.tagName),
            )
        };
        let getPlanView = () => {
            return this.renderPageContainer(
                AppViewMode.planView,
                this.renderPlanView.bind(this),
            )
        };
        let getPlanViewWithTag = (somethingWithParams: any) => {
            return this.renderPageContainer(
                AppViewMode.planView,
                this.renderPlanView.bind(this, somethingWithParams.match.params.tagName),
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

        let getNotes = () => {
            return this.renderPageContainer(
                AppViewMode.noteView,
                this.renderNotes.bind(this)
            )
        };

        return <div>
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={getMergedView} />
                    <Route exact path="/plan" component={getPlanView} />
                    <Route path="/plan/:tagName" component={getPlanViewWithTag} />
                    <Route path="/tasks" component={getTaskBoard} />
                    <Route exact path="/cal" component={getCalendarWeek.bind(this, CalendarViewType.week)} />
                    <Route
                        path="/cal/week"
                        component={getCalendarWeek.bind(this, CalendarViewType.week)}
                    />
                    <Route
                        path="/cal/day"
                        component={getCalendarWeek.bind(this, CalendarViewType.day)}
                    />
                    <Route path="/tag/:tagName" component={getMergedWithTag} />
                    <Route path="/tags" component={getTagGraph} />
                    <Route path="/notes" component={getNotes} />
                </Switch>
            </BrowserRouter>
        </div>
    }
}

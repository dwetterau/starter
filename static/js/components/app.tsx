import * as jQuery from "jquery";
import * as React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom"

import {
    Event, Tag, Task, User, TagsById, EventsById, TasksById, NotesById, Note,
    CapturesById, Capture
} from "../models";
import {TagGraphComponent} from "./tag/tag_graph";
import {TaskBoardComponent, TaskBoardView, TaskBoardViewType} from "./task/task_board"
import {CalendarComponent, CalendarView, CalendarViewType} from "./event/calendar";
import {AppHeader} from "./app_header";
import {
    signalDisplayTaskInfo, signalBeginEditingTask, signalDisplayTagInfo,
} from "../events";
import {TaskDetailComponent} from "./task/task_detail";
import {TagDetailComponent} from "./tag/tag_detail";
import {NoteBoardComponent} from "./notes/note_board";
import {CaptureListComponent} from "./capture/capture_list";
import {API} from "../api";

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
    taskBoardView: TaskBoardView
    calendarView: CalendarView
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
        this.state = {
            tasks: props.tasks,
            events: props.events,
            tags: props.tags,
            notes: props.notes,
            captures: props.captures,
            tagsById: API.getTagsById(props.tags),
            eventsById: API.getEventsById(props.events),
            tasksById: API.getTasksById(props.tasks),
            notesById: API.getNotesById(props.notes),
            capturesById: API.getCapturesById(props.captures),
            detailInfo: {},
            taskBoardView: {
                type: TaskBoardViewType.status,
                shouldHideClosedTasks: false,
            },
            calendarView: CalendarComponent.getInitialView(CalendarViewType.week),
        };
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
        this.setState({
            detailInfo: {
                taskId: null,
                tagId: tagId,
            },
        });
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
    updateStateWithTasks(tasks: Array<Task>) {
        this.setState({
            tasks: tasks,
            tasksById: API.getTasksById(tasks),
        })
    }

    createTask(task: Task) {
        API.createTask(task, (task) => {
            this.updateStateWithTasks(this.state.tasks.concat([task]));
        }).fail(this.handleApiError.bind(this));
    }

    updateTask(task: Task) {
        API.updateTask(task, (updatedTask) => {
            const newTasks = this.state.tasks.map((task: Task) => {
                if (task.id == updatedTask.id) {
                    return updatedTask
                } else {
                    return task
                }
            });
            this.updateStateWithTasks(newTasks);
        }).fail(this.handleApiError.bind(this))
    }

    deleteTask(task: Task) {
        API.deleteTask(task, (deletedTask) => {
            this.updateStateWithTasks(this.state.tasks.filter((task: Task) => {
                return task.id != deletedTask.id;
            }));
        }).fail(this.handleApiError.bind(this))
    }

    updateStateWithEvents(event: Event, isDelete: boolean, events: Array<Event>) {
        let changedTasks = API.getTasksAfterEventChange(
            this.state.tasks,
            event,
            isDelete,
        );
        if (changedTasks.length == 0) {
            // Easy case, just update the event state
            this.setState({
                events: events,
                eventsById: API.getEventsById(events),
            })
        }
        // Otherwise, fix up the tasks too
        let changedTasksById = API.getTasksById(changedTasks);
        let fixedTasks = this.state.tasks.map((task) => {
            if (!changedTasksById.hasOwnProperty(task.id)) {
                return task
            } else {
                return changedTasksById[task.id];
            }
        });

        this.setState({
            events: events,
            eventsById: API.getEventsById(events),
            tasks: fixedTasks,
            tasksById: API.getTasksById(fixedTasks),
        })
    }

    createEvent(event: Event) {
        API.createEvent(event, (event) => {
            this.updateStateWithEvents(
                event,
                false,
                this.state.events.concat([event]),
            )
        }).fail(this.handleApiError.bind(this));
    }

    updateEvent(event: Event) {
        API.updateEvent(event, (updatedEvent) => {
            let updatedEvents = this.state.events.map((event: Event) => {
                if (event.id == updatedEvent.id) {
                    return updatedEvent
                } else {
                    return event
                }
            });
            this.updateStateWithEvents(
                updatedEvent,
                false,
                updatedEvents,
            );
        }).fail(this.handleApiError.bind(this));
    }

    deleteEvent(event: Event) {
        API.deleteEvent(event, (deletedEvent) => {
            const events = this.state.events.filter((event: Event) => {
                return event.id != deletedEvent.id;
            });
            this.updateStateWithEvents(deletedEvent, true, events);
        }).fail(this.handleApiError.bind(this))
    }

    updateStateWithTags(tags: Array<Tag>) {
        this.setState({
            tags: tags,
            tagsById: API.getTagsById(tags),
        })
    }

    createTag(tag: Tag) {
        API.createTag(tag, (tag) => {
            this.updateStateWithTags(this.state.tags.concat([tag]));
        }).fail(this.handleApiError.bind(this));
    }

    updateTag(tag: Tag) {
        API.updateTag(tag, (updatedTag) => {
            const newTags = this.state.tags.map((tag: Tag) => {
                if (tag.id == updatedTag.id) {
                    return updatedTag
                } else {
                    return tag
                }
            });
            this.updateStateWithTags(newTags);
        }).fail(this.handleApiError.bind(this));
    }

    deleteTag(tag: Tag) {
        // TODO: Filter out all tags and children or something
    }

    updateStateWithNotes(notes: Array<Note>) {
        this.setState({
            notes: notes,
            notesById: API.getNotesById(notes),
        })
    }

    createNote(note: Note) {
        API.createNote(note, (note) => {
            this.updateStateWithNotes(this.state.notes.concat([note]));
        }).fail(this.handleApiError.bind(this));
    }

    updateNote(note: Note) {
        API.updateNote(note, (updatedNote) => {
            const newNotes = this.state.notes.map((note: Note) => {
                if (note.id == updatedNote.id) {
                    return updatedNote
                } else {
                    return note
                }
            });
            this.updateStateWithNotes(newNotes);
        }).fail(this.handleApiError.bind(this));
    }

    deleteNote(note: Note) {
        API.deleteNote(note, (deletedNote) => {
            this.updateStateWithNotes(this.state.notes.filter((note: Note) => {
                return note.id != deletedNote.id;
            }));
        }).fail(this.handleApiError.bind(this));
    }

    updateStateWithCaptures(captures: Array<Capture>) {
        this.setState({
            captures: captures,
            capturesById: API.getCapturesById(captures),
        });
    }

    createCapture(capture: Capture) {
        API.createCapture(capture, (capture) => {
            this.updateStateWithCaptures(this.state.captures.concat([capture]));
        }).fail(this.handleApiError.bind(this));
    }

    deleteCapture(capture: Capture) {
        API.deleteCapture(capture, (deletedCapture) => {
            this.updateStateWithCaptures(this.state.captures.filter((capture: Capture) => {
                return capture.id != deletedCapture.id;
            }));
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
        this.setState({detailInfo: {}});
    }

    changeTaskBoardView(newView: TaskBoardView) {
        this.setState({taskBoardView: newView});
    }

    getCalendarView(viewType: CalendarViewType) {
        // If we guessed wrong on the initial load, just re-initialize
        if (this.state.calendarView.initial && viewType != this.state.calendarView.type) {
            let newView = CalendarComponent.getInitialView(viewType);
            // FIXME: This is calling setState during render(), we need to know this earlier!!
            this.setState({calendarView: newView});
            return newView
        }
        return this.state.calendarView;
    }

    changeCalendarView(newView: CalendarView) {
        newView.initial = false;
        this.setState({calendarView: newView});
    }

    getSelectedTag(tagName: string): Tag {
        let selectedTag: Tag = null;
        if (!tagName) {
            return selectedTag;
        }
        // See if any tag matches
        let lower = tagName.toLowerCase();
        for (let tagId of Object.keys(this.state.tagsById)) {
            if (this.state.tagsById[tagId].name.toLowerCase() == lower) {
                selectedTag = this.state.tagsById[tagId]
            }
        }
        return selectedTag
    }

    changeSelectedTag(tag: Tag) {
        if (!tag) {
            return;
        }
        // TODO: Switch all of this based off the real state when I separate out the routing.
        if (window.location.pathname == "/plan"
            || window.location.pathname == "/tag"
            || window.location.pathname == "/tasks"
        ) {
            window.location.href += "/" + tag.name
        } else if (window.location.pathname == "/") {
            window.location.href = "/tag/" + tag.name
        } else {
            // TODO: Do we need this?
            window.location.href = "../" + tag.name
        }
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

    renderTaskBoard(tagName: string) {
        return <TaskBoardComponent
            meUser={this.props.meUser}
            tasksById={this.state.tasksById}
            tagsById={this.state.tagsById}
            eventsById={this.state.eventsById}
            createTask={this.createTask.bind(this)}
            updateTask={this.updateTask.bind(this)}
            deleteTask={this.deleteTask.bind(this)}

            selectedTag={this.getSelectedTag(tagName)}
            changeSelectedTag={this.changeSelectedTag.bind(this)}
            view={this.state.taskBoardView}
            changeView={this.changeTaskBoardView.bind(this)}
        />
    }

    renderCalendar(viewType, simpleOptions) {
        return <CalendarComponent
            meUser={this.props.meUser}
            eventsById={this.state.eventsById}
            tagsById={this.state.tagsById}
            tasksById={this.state.tasksById}
            simpleOptions={simpleOptions}
            createEvent={this.createEvent.bind(this)}
            updateEvent={this.updateEvent.bind(this)}
            deleteEvent={this.deleteEvent.bind(this)}

            // TODO: Unify this better!
            selectedTag={this.getSelectedTag(null)}
            changeSelectedTag={this.changeSelectedTag.bind(this)}
            view={this.getCalendarView(viewType)}
            changeView={this.changeCalendarView.bind(this)}
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

    // Wraps the component in a main pane that also allows detail to be rendered at the bottom
    renderWrapped(component) {
        return <div className="merged-container">
            <div className="main-pane main-pane-full">
                <div className="merged-task-container">
                    {component()}
                </div>
                {this.renderDetail()}
            </div>
        </div>
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
                this.renderWrapped.bind(this, this.renderTaskBoard.bind(this)),
            )
        };
        let getCalendarWeek = (viewType) => {
            return this.renderPageContainer(
                AppViewMode.eventView,
                this.renderWrapped.bind(this, this.renderCalendar.bind(this, viewType, false)),
            )
        };
        let getTagGraph = () => {
            return this.renderPageContainer(
                AppViewMode.tagView,
                this.renderWrapped.bind(this, this.renderTagGraph.bind(this)),
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
                <div>
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
                </div>
            </BrowserRouter>
        </div>
    }
}

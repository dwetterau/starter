import * as jQuery from "jquery";
import * as React from "react";
import {Router, Route, browserHistory} from "react-router"

import {Event, Tag, Task, User, TagsById, EventsById, TasksById, NotesById, Note} from "../models";
import {TagGraphComponent} from "./tag/tag_graph";
import {TaskBoardComponent} from "./task/task_board"
import {CalendarComponent, CalendarViewType} from "./event/calendar";
import {AppHeader} from "./app_header";
import {NotifierComponent} from "./notifier";
import {
    signalDisplayTaskInfo, signalBeginEditingTask, signalDisplayTagInfo,
} from "../events";
import {TaskDetailComponent} from "./task/task_detail";
import {TagDetailComponent} from "./tag/tag_detail";
import {NoteBoardComponent} from "./notes/note_board";
import {NoteComponent} from "./notes/note"
import {getTagAndDescendantsRecursive} from "./lib/util";

export interface AppProps {
    meUser: User,
    tasks: Array<Task>,
    events: Array<Event>,
    tags: Array<Tag>,
    notes: Array<Note>,
}

interface DetailInfo {
    tagId?: number,
    taskId?: number,
}

export interface AppState {
    tasks: Array<Task>,
    events: Array<Event>,
    tags: Array<Tag>,
    notes: Array<Note>,
    tagsById: TagsById,
    eventsById: EventsById,
    tasksById: TasksById,
    detailInfo: DetailInfo,
    notesById: NotesById,
}

export enum AppViewMode {
    mergedView,
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
            tagsById: {},
            eventsById: {},
            tasksById: {},
            detailInfo: {},
            notesById: {},
        };
        App.updateTagsById(newState);
        App.updateEventsById(newState);
        App.updateTasksById(newState);
        App.updateNotesById(newState);
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
        let taskId = e.detail;
        this.state.detailInfo = {
            taskId: taskId,
            tagId: null,
        };

        this.setState(this.state);
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
            App.updateTasksById(this.state);
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
            this.updateTaskToEventsAfterEventChange(updatedEvent, false);
            this.setState(this.state);
        });
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
        });
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
        });
    }

    deleteNote(note: Note) {
        jQuery.post('/api/1/note/delete', {id: note.id}, (deletedNoteJson: string) => {
            const deletedNoteId = JSON.parse(deletedNoteJson).id;
            this.state.notes = this.state.notes.filter((note: Note) => {
                return note.id != deletedNoteId;
            });
            App.updateNotesById(this.state);
            this.setState(this.state);
        })
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

    renderNotifier() {
        return <NotifierComponent
            tasks={this.state.tasks}
            events={this.state.events}
        />
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

    computeNoteForNotepad(tagName?: string): null | Note {
        // Can't pick a note without a selected tagName for now
        if (!tagName) {
            return null
        }

        // Find the note with the newest startTime and the provided tag.
        let tagId: number;
        for (let tag of this.state.tags) {
            if (tag.name.toLowerCase() == tagName.toLowerCase()) {
                tagId = tag.id;
                break
            }
        }
        if (!tagId) {
            return null
        }
        let allChildIdsOfSelectedTag = getTagAndDescendantsRecursive(
            tagId, this.state.tagsById
        );

        let newest = -1;
        let finalNote: Note = null;
        for (let note of this.state.notes) {
            if (note.tagIds.length == 0) {
                continue
            }
            for (let noteTagId of note.tagIds) {
                if (allChildIdsOfSelectedTag[noteTagId]) {
                    // See if this is the newest
                    if (note.creationTime > newest) {
                        newest = note.creationTime;
                        finalNote = note;
                        break;
                    }
                }
            }
        }

        return finalNote
    }

    renderNotepad(tagName) {
        // For now, don't show if we're going to show detail instead.
        if (this.state.detailInfo.tagId || this.state.detailInfo.taskId) {
            return
        }

        let note = this.computeNoteForNotepad(tagName);
        if (note == null) {
            return
        }
        return <div className="merged-notepad-container">
            <NoteComponent
                meUser={this.props.meUser}
                note={note}
                tagsById={this.state.tagsById}
                updateNote={this.updateNote.bind(this)}
                deleteNote={this.deleteNote.bind(this)}
            />
        </div>
    }

    renderMergedView(tagName) {
        return <div className="merged-container">
            <div className="main-pane">
                <div className="merged-task-container">
                    {this.renderTaskBoard(tagName)}
                </div>
                {this.renderNotepad(tagName)}
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
        let getMergedWithTag = (somethingWithParams: any) => {
            return this.renderPageContainer(
                AppViewMode.mergedView,
                this.renderMergedView.bind(this, somethingWithParams.params.tagName),
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
                <Route path="/tag/:tagName" component={getMergedWithTag} />
                <Route path="/tags" component={getTagGraph} />
                <Route path="/notes" component={getNotes} />
            </Router>
        </div>
    }
}

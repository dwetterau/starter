import * as React from "react";
import * as jQuery from "jquery";
import * as moment from "moment";

import {EditTaskComponent} from "./edit_task";
import {
    Task, stateNameList, User, priorityNameList, TagsById, Tag, EventsById,
    TasksById
} from "../../models";
import {TaskComponent} from "./task";
import {TokenizerComponent, Tokenizable} from "../tokenizer";
import {ModalComponent} from "../lib/modal";
import {
    signalDisplayTaskInfo, signalBeginEditingTask
} from "../../events";
import {getTagAndDescendantsRecursive} from "../lib/util";

export interface TaskBoardProps {
    meUser: User,
    tasksById: TasksById,
    tagsById: TagsById,
    eventsById: EventsById,
    createTask: (task: Task) => void,
    updateTask: (task: Task) => void,
    deleteTask: (task: Task) => void,

    selectedTag?: Tag,
    changeSelectedTag: (tag?: Tag) => void,
    view: TaskBoardView,
    changeView: (view: TaskBoardView) => void,
}

export interface TaskBoardState {
    columns: Array<Array<Task>>,
    headers: Array<string>,
    columnTypes: Array<number>,
    createColumnType?: number,
    draggingTask?: Task,
    editingTask?: Task,
}

export interface TaskBoardView {
    type: TaskBoardViewType,
    shouldHideClosedTasks: boolean,
}

export enum TaskBoardViewType {
    status,
    priority
}

export class TaskBoardComponent extends React.Component<TaskBoardProps, TaskBoardState> {

    constructor(props: TaskBoardProps) {
        super(props);

        this.state = this.getState(props);
    }

    componentWillReceiveProps(props: TaskBoardProps) {
        this.setState(this.getState(props))
    }

    getState(props: TaskBoardProps): TaskBoardState {
        const [headers, columnTypes, columns] = this.divideByType(
            props.tasksById,
            props.view.type,
            props.selectedTag,
            props.view.shouldHideClosedTasks,
        );

        return {
            columns,
            headers,
            columnTypes,
            createColumnType: null,
            draggingTask: null,
            editingTask: null,
        };
    }

    _handleBeginEditingTask = null;
    componentDidMount() {
        this._handleBeginEditingTask = this.handleBeginEditingTask.bind(this);
        document.addEventListener(signalBeginEditingTask, this._handleBeginEditingTask);
    }

    componentWillUnmount() {
        document.removeEventListener(signalBeginEditingTask, this._handleBeginEditingTask);
        this._handleBeginEditingTask = null;
    }

    handleBeginEditingTask(e: CustomEvent) {
        // Sets the task identified by the event to be selected
        if (this.state.editingTask) {
            // Already editing a different task.
            return;
        }

        const taskId = e.detail;
        this.setState({editingTask: this.props.tasksById[taskId]});
    }

    divideByType(
        tasksById: TasksById,
        type: TaskBoardViewType,
        selectedTag: Tag,
        shouldHideClosedTasks: boolean,
    ): [Array<string>, Array<number>, Array<Array<Task>>] {

        const columns: {[columnType: number]: Array<Task>} = {};
        const columnList: Array<Array<Task>> = [];
        const headerList: Array<string> = [];
        const columnTypes: Array<number> = [];


        const typeToHelpers: {
            [type: string]: {
                attr: string,
                orderedNameAndValue: Array<Array<any>>
                sortFunc: (a: Task, b: Task) => number
            }
        } = {};
        typeToHelpers[TaskBoardViewType.status] = {
            attr: "state",
            orderedNameAndValue: stateNameList,
            sortFunc: (a: Task, b: Task) => {
                // If the tasks are closed, we want to sort by last updated time instead
                // of by priority.
                if (a.state == 1000 && b.state == 1000) {
                    return b.stateUpdatedTime - a.stateUpdatedTime
                }

                // This is to put UNKNOWN priority at the top.
                const aPriority = a.priority == 0 ? 1000 : a.priority;
                const bPriority = b.priority == 0 ? 1000 : b.priority;
                if (aPriority != bPriority) {
                    return bPriority - aPriority
                }
                // Sort tasks with a due date at the top of their priority.
                const aDueTime = a.dueTime == 0 ? Number.MAX_VALUE : a.dueTime;
                const bDueTime = b.dueTime == 0 ? Number.MAX_VALUE : b.dueTime;
                return aDueTime - bDueTime
            }
        };
        typeToHelpers[TaskBoardViewType.priority] = {
            attr: "priority",
            orderedNameAndValue: priorityNameList,
            sortFunc: (a: Task, b: Task) => {
                return a.state - b.state
            }
        };

        if (!typeToHelpers[type]) {
            throw Error("Split type not implemented: " + type)
        }
        const {attr, orderedNameAndValue, sortFunc} = typeToHelpers[type];

        let allChildIdsOfSelectedTag: {[id: number]: boolean} = {};
        if (selectedTag) {
            allChildIdsOfSelectedTag = getTagAndDescendantsRecursive(
                selectedTag.id, this.props.tagsById
            );
        }

        const shouldHideTask = (task: Task) => {
            if (selectedTag) {
                // See if the task has the right tag
                let matches = false;
                task.tagIds.forEach((tagId: number) => {
                    matches = matches || allChildIdsOfSelectedTag[tagId]
                });
                if (!matches) {
                    return true;
                }
            }

            if (!this.state) {
                // Other checks can only return true if state is defined.
                return false;
            }

            if (task.state == 1000) {
                if (type == TaskBoardViewType.priority && shouldHideClosedTasks) {
                    return true;
                }
            }

            return false;
        };

        // Categorize each task
        for (let taskId of Object.keys(tasksById)) {
            let task = tasksById[taskId];
            if (shouldHideTask(task)) {
                continue;
            }

            if (!columns[task[attr]]) {
                columns[task[attr]] = [task];
            } else {
                columns[task[attr]].push(task)
            }
        }

        // Order the columns
        orderedNameAndValue.forEach((nameAndValue: [string, number]) => {
            let [name, value] = nameAndValue;
            // Sort each column
            const column = columns[value] || [];
            column.sort(sortFunc);
            columnList.push(columns[value] || []);
            headerList.push(name);
            columnTypes.push(value);
        });

        return [headerList, columnTypes, columnList];
    }

    _dragTargetElement: any = null;
    onDragStart(task: Task, event: DragEvent) {
        if (this.state.draggingTask) {
            throw Error("Already was dragging a task...")
        }
        this.setState({draggingTask: task});
        event.dataTransfer.setData("id", task.id.toString());
        event.dataTransfer.effectAllowed = "move";
        this._dragTargetElement = jQuery(event.target)
    }

    onDragEnd(task: Task) {
        if (this.state.draggingTask != task) {
            return
        }

        // Clean up any leftover state if we didn't successfully drop somewhere
        this.setState({draggingTask: null});
        this._dragTargetElement.show();
    }

    onDrop(columnType: number, event: DragEvent) {
        if (!this.state.draggingTask) {
            // No task was being dragged
            return
        }
        event.dataTransfer.dropEffect = "move";
        event.preventDefault();

        // Update the task with the new column
        let taskToUpdate = this.state.draggingTask;
        if (this.props.view.type == TaskBoardViewType.status) {
            const oldState = taskToUpdate.state;
            taskToUpdate.state = columnType;
            if (oldState != columnType) {
                taskToUpdate.stateUpdatedTime = moment().unix() * 1000;
            }
        } else if (this.props.view.type == TaskBoardViewType.priority) {
            taskToUpdate.priority = columnType;
        } else {
            throw Error("Haven't implement drag and drop for this view type yet")
        }
        this.props.updateTask(taskToUpdate);

        jQuery(event.target).removeClass("drop-container");
        this.setState({draggingTask: null});
        this._dragTargetElement.show();
    }

    markColumnAsDraggable(columnDiv: any) {
        // Also try to remove it from everywhere else
        let otherColumns = jQuery(".drop-container");
        if (otherColumns.length == 1 && otherColumns[0] != columnDiv) {
            otherColumns.removeClass("drop-container");
        }
        jQuery(columnDiv).addClass("drop-container");
    }

    onDragOver(event: DragEvent) {
        // This marks the element as a "drop target"
        event.preventDefault();
        if (!this.state.draggingTask) {
            // No task was being dragged
            return
        }
        this._dragTargetElement.hide();
        if (jQuery(event.target).hasClass("column-container")) {
            this.markColumnAsDraggable(event.target);
        } else {
            this.markColumnAsDraggable(
                jQuery(event.target).parents(".column-container")[0]
            );
        }
    }

    onClick(taskId: number, e: any) {
        // We stop propagation to prevent task creation modals from appearing.
        e.stopPropagation();

        // Send an event to show the detail for the task
        let event = new CustomEvent(
            signalDisplayTaskInfo,
            {'detail': taskId},
        );
        document.dispatchEvent(event);

        return false;
    }

    changeViewType(type: TaskBoardViewType) {
        this.props.changeView({
            type: type,
            shouldHideClosedTasks: this.props.view.shouldHideClosedTasks,
        });
    }

    changeHideClosedTasks() {
        this.props.changeView({
            type: this.props.view.type,
            shouldHideClosedTasks: !this.props.view.shouldHideClosedTasks,
        });
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

            // If we were at a /tag/<tag> url, redirect to / because if we don't, the hacky
            // /tag/<tag> logic will re-add this tag by looking at the URL :(
            if (window.location.pathname.indexOf("/tag/") == 0) {
                window.location.pathname = "/";
            }
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

    clearCreateColumnType() {
        this.setState({createColumnType: null});
    }

    createTask(columnType: number) {
        if (this.state.createColumnType != null) {
            // Already creating... cancel this request
            return
        }
        this.setState({createColumnType: columnType});
    }

    clearEditingTask() {
        this.setState({editingTask: null});
    }

    renderTypeChoice(type: TaskBoardViewType) {
        let className = "view-type-choice";
        if (type == this.props.view.type) {
            className += " -selected"
        }
        const typeToName: {[type: number]: string} = {};
        typeToName[TaskBoardViewType.priority] = "Priority";
        typeToName[TaskBoardViewType.status] = "Status";

        return (
            <div className={className} key={type}
                 onClick={this.changeViewType.bind(this, type)}
            >
                {typeToName[type]}
            </div>
        )
    }

    renderTypeSelector() {
        return (
            <div className="view-type-selector">
                {this.renderTypeChoice(TaskBoardViewType.priority)}
                {this.renderTypeChoice(TaskBoardViewType.status)}
            </div>
        )
    }

    renderHideClosedTasks() {
        if (this.props.view.type == TaskBoardViewType.status) {
            // Don't show an empty column...
            return
        }

        return (
            <div className="hide-closed-tasks">
                <label htmlFor="hide-closed">Hide closed?</label>
                <input
                    id="hide-closed"
                    type="checkbox"
                    onChange={this.changeHideClosedTasks.bind(this)}
                    checked={this.props.view.shouldHideClosedTasks}
                />
            </div>
        )
    }

    renderOptions() {
        return (
            <div className="task-board-options">
                {this.renderTypeSelector()}
                {this.renderTagSelector()}
                {this.renderHideClosedTasks()}
            </div>
        )
    }

    renderTagSelector() {
        return (
            <div className="task-board-tag-selector-container">
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

    renderColumn(column: Array<Task>, header: string, columnType: number) {

        return <div
            className="column-container" key={header}
            onDrop={this.onDrop.bind(this, columnType)}
            onDragOver={this.onDragOver.bind(this)}
            onClick={this.createTask.bind(this, columnType)}
        >
            <div className="column-header">{header}</div>
            {column.map((task) => {
                // TODO: determine draggability programatically
                return <div key={task.id} className="draggable-task"
                            draggable={true}
                            onDragStart={this.onDragStart.bind(this, task)}
                            onDragEnd={this.onDragEnd.bind(this, task)}
                            onClick={this.onClick.bind(this, task.id)}
                        >
                    <TaskComponent
                        task={task}
                        viewType={this.props.view.type}
                        tagsById={this.props.tagsById}
                        eventsById={this.props.eventsById}
                    />
                </div>
            })}
        </div>
    }

    renderColumns() {
        const renderedColumns: Array<any> = [];
        let i = 0;
        for (; i < this.state.columns.length; i++) {
            renderedColumns.push(
                this.renderColumn(
                    this.state.columns[i],
                    this.state.headers[i],
                    this.state.columnTypes[i],
                )
            );
        }
        return <div className="full-column-container">
            <div className="columns-container">
                {renderedColumns}
            </div>
        </div>
    }

    renderEditingTask() {
        if (!this.state.editingTask) {
            return
        }
        return <ModalComponent cancelFunc={this.clearEditingTask.bind(this)}>
            <EditTaskComponent
                meUser={this.props.meUser}
                task={this.state.editingTask}
                tagsById={this.props.tagsById}
                createMode={false}
                createTask={(task: Task) => {}}
                updateTask={this.props.updateTask}
                deleteTask={this.props.deleteTask} />
        </ModalComponent>
    }

    renderCreateTask() {
        if (this.state.createColumnType == null) {
            return;
        }

        let initialPriority = null;
        let initialState = null;
        if (this.props.view.type == TaskBoardViewType.priority) {
            initialPriority = this.state.createColumnType;
            initialState = 0;
        }
        if (this.props.view.type == TaskBoardViewType.status) {
            initialPriority = 0;
            initialState = this.state.createColumnType;
        }

        const initialTags: Array<number> = [];
        if (this.props.selectedTag) {
            initialTags.push(this.props.selectedTag.id);
        }
        return <ModalComponent cancelFunc={this.clearCreateColumnType.bind(this)}>
            <EditTaskComponent
                meUser={this.props.meUser}
                tagsById={this.props.tagsById}
                createMode={true}
                createTask={this.props.createTask}
                initialPriority={initialPriority}
                initialState={initialState}
                initialTags={initialTags}
                updateTask={(task: Task) => {}}
                deleteTask={(task: Task) => {}}
            />
        </ModalComponent>
    }

    render() {
        return <div className="task-board">
            {this.renderOptions()}
            {this.renderColumns()}
            {this.renderEditingTask()}
            {this.renderCreateTask()}
        </div>
    }
}

import * as React from "react";
import * as jQuery from "jquery";

import {EditTaskComponent} from "./edit_task";
import {Task, stateNameList, User, priorityNameList, TagsById, Tag, EventsById} from "../../models";
import {TaskComponent} from "./task";
import {TokenizerComponent, Tokenizable} from "../tokenizer";
import {ModalComponent} from "../lib/modal";
import {TaskDetailComponent} from "./task_detail";

export interface TaskBoardProps {
    meUser: User,
    tasks: Array<Task>,
    tagsById: TagsById,
    eventsById: EventsById,
    createTask: (task: Task) => void,
    updateTask: (task: Task) => void,
    deleteTask: (task: Task) => void,
}
export interface TaskBoardState {
    viewType: TaskBoardViewType,
    columns: Array<Array<Task>>,
    headers: Array<string>,
    columnTypes: Array<number>,
    createColumnType?: number,
    draggingTask?: Task,
    editingTask?: Task,
    selectedTask?: Task,
    shouldHideClosedTasks: boolean,
    selectedTag?: Tag,
}

export enum TaskBoardViewType {
    status,
    priority
}

export class TaskBoardComponent extends React.Component<TaskBoardProps, TaskBoardState> {

    constructor(props: TaskBoardProps) {
        super(props);

        this.state = this.getState(props, TaskBoardViewType.status);
    }

    componentWillReceiveProps(props: TaskBoardProps) {
        this.setState(this.getState(props, this.state.viewType))
    }

    getState(props: TaskBoardProps, viewType: TaskBoardViewType): TaskBoardState {
        const [headers, columnTypes, columns] = this.divideByType(props.tasks, viewType);
        const newState: TaskBoardState = {
            viewType,
            columns,
            headers,
            columnTypes,
            createColumnType: null,
            draggingTask: null,
            editingTask: null,
            selectedTask: (this.state) ? this.state.selectedTask : null,
            selectedTag: null,
            shouldHideClosedTasks: (this.state) ? this.state.shouldHideClosedTasks : true,
        };
        if (this.state && this.state.selectedTag && props.tagsById[this.state.selectedTag.id]) {
            // Copy over the previous selectedTag
            newState.selectedTag = this.state.selectedTag;
        }
        return newState;
    }

    divideByType(tasks: Array<Task>, type: TaskBoardViewType): [
            Array<string>, Array<number>, Array<Array<Task>>] {

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
                // This is to put UNKNOWN priority at the top.
                const aPriority = a.priority == 0 ? 1000 : a.priority;
                const bPriority = b.priority == 0 ? 1000 : b.priority;
                return bPriority - aPriority
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

        const shouldHideTask = (task: Task) => {
            if (!this.state) {
                // Other checks can only return true if state is defined.
                return false;
            }

            if (task.state == 1000) {
                if (type == TaskBoardViewType.priority && this.state.shouldHideClosedTasks) {
                    return true;
                }
            }

            if (this.state.selectedTag) {
                // See if the task has the right tag
                let matches = false;
                task.tagIds.forEach((tagId: number) => {
                    matches = matches || allChildIdsOfSelectedTag[tagId]
                });
                if (!matches) {
                    return true;
                }
            }

            return false;
        };

        // Categorize each task
        tasks.forEach((task: Task) => {
            if (shouldHideTask(task)) {
                return
            }

            if (!columns[task[attr]]) {
                columns[task[attr]] = [task];
            } else {
                columns[task[attr]].push(task)
            }
        });

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
        this.state.draggingTask = task;
        this.setState(this.state);
        this._dragTargetElement = jQuery(event.target)
    }

    onDragEnd(task: Task) {
        if (this.state.draggingTask != task) {
            return
        }

        // Clean up any leftover state if we didn't successfully drop somewhere
        this.state.draggingTask = null;
        this.setState(this.state);
        this._dragTargetElement.show();
    }

    onDrop(columnType: number, event: DragEvent) {
        if (!this.state.draggingTask) {
            // No task was being dragged
            return
        }
        event.preventDefault();

        // Update the task with the new column
        if (this.state.viewType == TaskBoardViewType.status) {
            this.state.draggingTask.state = columnType;
        } else if (this.state.viewType == TaskBoardViewType.priority) {
            this.state.draggingTask.priority = columnType;
        } else {
            throw Error("Haven't implement drag and drop for this view type yet")
        }
        this.props.updateTask(this.state.draggingTask);

        jQuery(event.target).removeClass("drop-container");
        this.state.draggingTask = null;
        this.setState(this.state);
        this._dragTargetElement.show();
    }

    onDragOver(event: any) {
        if (!this.state.draggingTask) {
            // No task was being dragged
            return
        }
        event.preventDefault();
        this._dragTargetElement.hide();
        jQuery(event.target).addClass("drop-container")
    }

    onDragLeave(event: any) {
        if (!this.state.draggingTask) {
            // No event was being dragged
            return
        }
        jQuery(event.target).removeClass("drop-container")
    }

    onClick(task: Task, e: any) {
        // We stop propagation to prevent event creation modals from appearing.
        e.stopPropagation();

        this.state.selectedTask = task;
        this.setState(this.state);

        return false;
    }

    onDoubleClick(task: Task) {
        this.state.editingTask = task;
        this.setState(this.state)
    }

    changeViewType(type: TaskBoardViewType) {
        const [headers, columnTypes, columns] = this.divideByType(this.props.tasks, type);
        this.state.viewType = type;
        this.state.headers = headers;
        this.state.columnTypes = columnTypes;
        this.state.columns = columns;

        this.setState(this.state);
    }

    changeHideClosedTasks() {
        this.state.shouldHideClosedTasks = !this.state.shouldHideClosedTasks;

        // As a hack to reflow the columns, we will "change the view type to the current one".
        this.changeViewType(this.state.viewType);

        // We omit a call to setState ourselves because the hiding of the task will also call
        // setState.
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

        // As a hack to reflow the columns, we will "change the view type to the current one".
        this.changeViewType(this.state.viewType);
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
        this.state.createColumnType = null;
        this.setState(this.state);
    }

    createTask(columnType: number) {
        if (this.state.createColumnType != null) {
            // Already creating... cancel this request
            return
        }
        this.state.createColumnType = columnType;
        this.setState(this.state);
    }

    clearEditingTask() {
        this.state.editingTask = null;
        this.setState(this.state);
    }

    renderTypeChoice(type: TaskBoardViewType) {
        let className = "view-type-choice";
        if (type == this.state.viewType) {
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
        if (this.state.viewType == TaskBoardViewType.status) {
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
                    checked={this.state.shouldHideClosedTasks}
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
            onDragLeave={this.onDragLeave.bind(this)}
            onClick={this.createTask.bind(this, columnType)}
        >
            <div className="column-header">{header}</div>
            {column.map((task) => {
                // TODO: determine draggability programatically
                return <div key={task.id} className="draggable-task"
                            draggable={true}
                            onDragStart={this.onDragStart.bind(this, task)}
                            onDragEnd={this.onDragEnd.bind(this, task)}
                            onClick={this.onClick.bind(this, task)}
                            onDoubleClick={this.onDoubleClick.bind(this, task)} >
                    <TaskComponent
                        task={task}
                        viewType={this.state.viewType}
                        tagsById={this.props.tagsById}
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
        if (this.state.viewType == TaskBoardViewType.priority) {
            initialPriority = this.state.createColumnType;
            initialState = 0;
        }
        if (this.state.viewType == TaskBoardViewType.status) {
            initialPriority = 0;
            initialState = this.state.createColumnType;
        }

        const initialTags: Array<number> = [];
        if (this.state.selectedTag) {
            initialTags.push(this.state.selectedTag.id);
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

    renderSelectedTask() {
        if (!this.state.selectedTask) {
            return;
        }
        return <TaskDetailComponent
            task={this.state.selectedTask}
            tagsById={this.props.tagsById}
            eventsById={this.props.eventsById}
        />
    }

    render() {
        return <div className="task-board">
            {this.renderOptions()}
            {this.renderColumns()}
            {this.renderEditingTask()}
            {this.renderCreateTask()}
            {this.renderSelectedTask()}
        </div>
    }
}

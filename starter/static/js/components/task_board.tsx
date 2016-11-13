import * as React from "react";
import * as jQuery from "jquery";

import {EditTaskComponent} from "./edit_task";
import {Task, stateNameList, User, priorityNameList} from "../models";
import {TaskComponent} from "./task";

export interface TaskBoardProps {
    meUser: User,
    tasks: Array<Task>,
    updateTask: (task: Task) => void,
    deleteTask: (task: Task) => void,
}
export interface TaskBoardState {
    viewType: TaskBoardViewType,
    columns: Array<Array<Task>>,
    headers: Array<string>,
    columnTypes: Array<number>,
    draggingTask?: Task,
    editingTask?: Task,
    shouldHideClosedTasks: boolean,
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
        return {
            viewType,
            columns,
            headers,
            columnTypes,
            draggingTask: null,
            editingTask: null,
            shouldHideClosedTasks: false,
        }
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

        const shouldHideTask = (task: Task) => {
            if (!this.state) {
                // This is the initial call where we are defining state...
                return false
            }
            return this.state.shouldHideClosedTasks && task.state == 1000
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
            // No event was being dragged
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
            // No event was being dragged
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

    onDoubleClick(task: Task) {
        // Idk, open an editor modal or something
        this.state.editingTask = task;
        this.setState(this.state)
    }

    changeViewType(type: TaskBoardViewType) {
        const [headers, columnTypes, columns] = this.divideByType(this.props.tasks, type);
        this.setState({
            viewType: type,
            headers,
            columnTypes,
            columns,
            shouldHideClosedTasks: this.state.shouldHideClosedTasks
        });
    }

    changeHideClosedTasks() {
        this.state.shouldHideClosedTasks = !this.state.shouldHideClosedTasks;

        // As a hack to reflow the columns, we will "change the view type to the current one".
        this.changeViewType(this.state.viewType);

        // We omit a call to setState ourselves because the hiding of the task will also call
        // setState.
    }

    renderTypeChoice(type: TaskBoardViewType) {
        let className = "view-type-choice";
        if (type == this.state.viewType) {
            className += " -selected"
        }
        return (
            <div className={className} key={type}
                 onClick={this.changeViewType.bind(this, type)}
            >
                {TaskBoardViewType[type]}
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
        return (
            <div className="hide-closed-tasks">
                Hide closed?
                <input type="checkbox" onChange={this.changeHideClosedTasks.bind(this)}
                       value={this.state.shouldHideClosedTasks.toString()}
                />
            </div>
        )
    }

    renderTypeBasedOptions() {
        if (this.state.viewType == TaskBoardViewType.priority) {
            return this.renderHideClosedTasks()
        }
    }

    renderOptions() {
        return (
            <div className="task-board-options">
                {this.renderTypeSelector()}
                {this.renderTypeBasedOptions()}
            </div>
        )
    }

    renderColumn(column: Array<Task>, header: string, columnType: number) {

        return <div className="column-container" key={header}
                    onDrop={this.onDrop.bind(this, columnType)}
                    onDragOver={this.onDragOver.bind(this)}
                    onDragLeave={this.onDragLeave.bind(this)} >
            <div className="column-header">{header}</div>
            {column.map((task) => {
                // TODO: determine draggability programatically
                return <div key={task.id} className="draggable-task"
                            draggable={true}
                            onDragStart={this.onDragStart.bind(this, task)}
                            onDragEnd={this.onDragEnd.bind(this, task)}
                            onDoubleClick={this.onDoubleClick.bind(this, task)} >
                    <TaskComponent task={task} viewType={this.state.viewType} />
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
            {renderedColumns}
        </div>
    }

    renderEditingTask() {
        if (!this.state.editingTask) {
            return
        }
        return <EditTaskComponent meUser={this.props.meUser}
                                  task={this.state.editingTask}
                                  updateTask={this.props.updateTask}
                                  deleteTask={this.props.deleteTask} />
    }

    render() {
        return <div className="task-board">
            {this.renderOptions()}
            {this.renderColumns()}
            {this.renderEditingTask()}
        </div>
    }
}

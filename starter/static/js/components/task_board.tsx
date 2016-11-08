import * as React from "react";
import * as jQuery from "jquery";

import {EditTaskComponent} from "./edit_task";
import {Task, stateNameList, User} from "../models";
import {TaskComponent} from "./task";

export interface TaskBoardProps {
    meUser: User,
    tasks: Array<Task>,
    updateTask: (task: Task) => void,
    deleteTask: (task: Task) => void,
}
export interface TaskBoardState {
    viewType: string,
    columns: Array<Array<Task>>,
    headers: Array<string>,
    columnTypes: Array<number>,
    draggingTask?: Task,
    editingTask?: Task,
}

export const TaskBoardViewTypes = {
    status: "status",
    priority: "priority"
};

export class TaskBoardComponent extends React.Component<TaskBoardProps, TaskBoardState> {

    constructor(props: TaskBoardProps) {
        super(props);

        this.state = this.getState(props);
    }

    componentWillReceiveProps(props: TaskBoardProps) {
        this.setState(this.getState(props))
    }

    getState(props: TaskBoardProps): TaskBoardState {
        const viewType = TaskBoardViewTypes.status;
        const [headers, columnTypes, columns] = this.divideByType(props.tasks, viewType);
        return {
            viewType,
            columns,
            headers,
            columnTypes,
            draggingTask: null,
            editingTask: null,
        }
    }

    divideByType(tasks: Array<Task>, type: string): [
            Array<string>, Array<number>, Array<Array<Task>>] {

        const columns: {[columnType: number]: Array<Task>} = {};
        const columnList: Array<Array<Task>> = [];
        const headerList: Array<string> = [];
        const columnTypes: Array<number> = [];
        if (type == TaskBoardViewTypes.status) {
            // Categorize each task
            tasks.forEach((task: Task) => {
                if (!columns[task.state]) {
                    columns[task.state] = [task];
                } else {
                    columns[task.state].push(task)
                }
            });

            // Order the columns
            stateNameList.forEach((stateAndValue: [string, number]) => {
                let [state, value] = stateAndValue;
                columnList.push(columns[value] || []);
                headerList.push(state);
                columnTypes.push(value);
            })
        } else {
            throw Error("Split type not implemented: " + type)
        }
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
        if (this.state.viewType == TaskBoardViewTypes.status) {
            this.state.draggingTask.state = columnType;
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
            {this.renderColumns()}
            {this.renderEditingTask()}
        </div>
    }
}

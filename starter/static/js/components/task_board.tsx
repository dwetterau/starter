import * as React from "react";
import {Task, stateNameList} from "../models";
import {TaskComponent} from "./task";

export interface TaskBoardProps {tasks: Array<Task>}
export interface TaskBoardState {
    viewType: string,
    columns: Array<Array<Task>>,
    headers: Array<string>
}

export const TaskBoardViewTypes = {
    status: "status",
    priority: "priority"
};

export class TaskBoardComponent extends React.Component<TaskBoardProps, TaskBoardState> {

    constructor(props: TaskBoardProps) {
        super(props);

        const viewType = TaskBoardViewTypes.status;
        const [headers, columns] = this.divideByType(this.props.tasks, viewType);
        this.state = {
            viewType,
            columns,
            headers
        }
    }

    divideByType(tasks: Array<Task>, type: string): [Array<string>, Array<Array<Task>>] {
        const columns: {[columnType: number]: Array<Task>} = {};
        const columnList: Array<Array<Task>> = [];
        const headerList: Array<string> = [];
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
            })
        } else {
            throw Error("Split type not implemented: " + type)
        }
        return [headerList, columnList];
    }

    renderColumn(column: Array<Task>, header: string) {
        return <div className="column-container" key={header}>
            <div className="column-header">{header}</div>
            {column.map((task) => {
                return <TaskComponent task={task} viewType={this.state.viewType} key={task.id} />
            })}
        </div>
    }

    renderColumns() {
        const renderedColumns: Array<any> = [];
        let i = 0;
        for (; i < this.state.columns.length; i++) {
            renderedColumns.push(
                this.renderColumn(this.state.columns[i], this.state.headers[i])
            );
        }
        return <div className="full-column-container">
            {renderedColumns}
        </div>
    }

    render() {
        return <div className="task-board">
            {this.renderColumns()}
        </div>
    }
}

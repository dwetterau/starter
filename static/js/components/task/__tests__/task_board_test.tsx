import * as React from "react";
import * as renderer from 'react-test-renderer';

/*
import {TaskBoardComponent, TaskBoardView, TaskBoardViewType} from "../task_board";
import {Task, TasksById} from "../../../models";
import {mockUser} from "../../../tests/mock_models";
import {API} from "../../../api";

function rendererFromView(view: TaskBoardView, tasks?: Array<Task>) {
    let tasksById: TasksById = {};
    if (tasks != null) {
        tasksById = API.getTasksById(tasks);
    }
    return renderer.create(
        <TaskBoardComponent
            meUser={mockUser()}
            tasksById={tasksById}
            tagsById={{}}
            eventsById={{}}
            createTask={() => {}}
            updateTask={() => {}}
            deleteTask={() => {}}
            changeSelectedTag={() => {}}
            view={view}
            changeView={() => {}}
        />
    )
}

test('Empty Task Board', () => {
    let tree = rendererFromView({
        type: TaskBoardViewType.status,
        shouldHideClosedTasks: false,
    }).toJSON();
    expect(tree).toMatchSnapshot("empty status view");

    tree = rendererFromView({
        type: TaskBoardViewType.priority,
        shouldHideClosedTasks: false,
    }).toJSON();
    expect(tree).toMatchSnapshot("empty priority view");
});
*/

test('no-op', () => {});
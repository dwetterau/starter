import * as React from "react";
import * as renderer from 'react-test-renderer';
import {Capturer} from "../capturer";
import {Capture} from "../../models";
import {mockUser} from "../../tests/mock_models"

test('Empty Capture List', () => {
    const testRenderer = renderer.create(
        <Capturer meUser={mockUser()} captures={[]}/>
    );
    let tree = testRenderer.toJSON();
    expect(tree).toMatchSnapshot();
});

test('Multiple captures', () => {
    let captures: Array<Capture> = [
        {id: 1, content: "content 1", creationTime: 4, authorId: 1},
        {id: 2, content: "content 2", creationTime: 5, authorId: 1},
    ];
    const testRenderer = renderer.create(
        <Capturer meUser={mockUser()} captures={captures}/>
    );
    let tree = testRenderer.toJSON();
    expect(tree).toMatchSnapshot();

    // Now delete a capture
    let capturer = testRenderer.root.findByType(Capturer).instance;
    capturer.updateStateWithCaptures(captures.slice(1));

    tree = testRenderer.toJSON();
    expect(tree).toMatchSnapshot();
});

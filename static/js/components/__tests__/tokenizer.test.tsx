import * as React from "react";
import * as renderer from 'react-test-renderer';
import {Tokenizable, TokenizerComponent} from "../tokenizer";


test('Dropdown select with enter', () => {
    let tokens: Array<Tokenizable> = [
        {label: "l1", value: "val1"},
        {label: "l2", value: "val2"},
        {label: "l2", value: "val3"},
    ];
    let onChange = function(tokens: Array<Tokenizable>) {

    };

    const testRenderer = renderer.create(
        <TokenizerComponent onChange={onChange} possibleTokens={tokens} />
    );
    let tree = testRenderer.toJSON();
    expect(tree).toMatchSnapshot();

    // Now start "typing"
    let tokenizer = testRenderer.root.findByType(TokenizerComponent).instance;
    tokenizer.updatePendingToken({target: {value: "l"}});
    tree = testRenderer.toJSON();
    expect(tree).toMatchSnapshot();

    // Let's make sure the autocompleteTokens match what we expect
    expect(tokenizer.state.autoCompleteTokens).toMatchObject(tokens);

    // Now pressing enter shouldn't do anything (too many autoComplete tokens)
    tokenizer.onKeyDown({key: "Enter"});
    tree = testRenderer.toJSON();
    expect(tree).toMatchSnapshot();

    // Type another character
    tokenizer.updatePendingToken({target: {value: "l1"}});
    tree = testRenderer.toJSON();
    expect(tree).toMatchSnapshot();
    expect(tokenizer.state.autoCompleteTokens).toMatchObject([tokens[0]]);

    // Now pressing enter should select it
    tokenizer.onKeyDown({key: "Enter"});
    tree = testRenderer.toJSON();
    expect(tree).toMatchSnapshot();
    expect(tokenizer.state.selectedTokenIndex).toEqual(0);
});

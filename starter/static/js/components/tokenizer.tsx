import * as React from "react";

export interface Tokenizable {
    label: string,
    value: any,
}
export interface TokenizerProps {
    onChange: (tokens: Array<Tokenizable>) => void,
    initialValues?: Array<Tokenizable>, // Note this does not work outside of the first call.
    possibleTokens?: Array<Tokenizable>,
    tokenLimit?: number, // Limit of 0 is the same as unlimited
}
export interface TokenizerState {
    tokens: Array<Tokenizable>,
    pendingToken: string,
    autoCompleteTokens: Array<Tokenizable>,
}

export class TokenizerComponent extends React.Component<TokenizerProps, TokenizerState> {
    constructor(props: TokenizerProps) {
        super(props);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(newProps: TokenizerProps) {
        this.setState(this.getState(newProps));
    }

    getState(props: TokenizerProps): TokenizerState {
        const newState: TokenizerState = {
            tokens: [],
            pendingToken: '',
            autoCompleteTokens: [],
        };
        if (props.initialValues) {
            props.initialValues.forEach((token) => {
                if (this.props.tokenLimit && newState.tokens.length >= this.props.tokenLimit) {
                    // We are at the limit of the number of tokens, return early.
                    return;
                }
                newState.tokens.push(token)
            })
        }
        if (this.state) {
            newState.pendingToken = this.state.pendingToken;
            newState.autoCompleteTokens = this.state.autoCompleteTokens;
        }

        return newState;
    }

    updateAutoComplete(newPendingToken): Array<Tokenizable> {
        newPendingToken = newPendingToken.toLowerCase();
        if (!this.props.possibleTokens || newPendingToken.length == 0) {
            // No tokens to autocomplete to.
            return []
        }

        // Really dumb linear time search!
        let rankAndTokens: Array<[number, Tokenizable]> = [];
        this.props.possibleTokens.forEach((possibleToken) => {
            let index = possibleToken.label.toLowerCase().indexOf(newPendingToken);
            if (index >= 0) {
                // Note: This makes this O(n^2) for now but whatever.
                if (!this.tokenAlreadyAdded(possibleToken)) {
                    rankAndTokens.push([index, possibleToken]);
                }
            }
        });

        // Sort by the index, which should put prefix matches first.
        rankAndTokens.sort((rankAndToken1, rankAndToken2) => {
            let [rank1, token1] = rankAndToken1;
            let [rank2, token2] = rankAndToken2;
            if (rank1 != rank2) {
                return rank1 - rank2;
            }
            if (token1.label < token2.label) {
                return -1;
            } else if (token1.label == token2.label) {
                return 0;
            } else {
                return 1;
            }
        });

        // Only keep the top 5 matches.
        rankAndTokens = rankAndTokens.slice(0, 5);

        return rankAndTokens.map((rankAndToken) => {
            return rankAndToken[1];
        });
    }

    updatePendingToken(event: any) {
        this.state.pendingToken = event.target.value.trim();
        this.state.autoCompleteTokens = this.updateAutoComplete(event.target.value);

        this.setState(this.state);
    }

    tokenAlreadyAdded(token: Tokenizable) {
        let found = false;
        this.state.tokens.forEach((t) => {
            if (token.value == t.value) {
                found = true;
            }
        });
        return found;
    }

    appendToken(token: Tokenizable) {
        this.state.tokens.push({
            label: token.label,
            value: token.value,
        });
        this.state.pendingToken = '';
        this.state.autoCompleteTokens = [];
        this.setState(this.state);

        this.props.onChange(this.state.tokens);
    }

    onClick(token: Tokenizable, event: any) {
        event.preventDefault();
        this.appendToken(token);
    }

    onKeyPress(event: any) {
        if (event.key == "Enter") {
            if (this.props.tokenLimit && this.state.tokens.length >= this.props.tokenLimit) {
                // We are at the limit of the number of tokens, return early.
                return;
            }

            const newToken = this.state.pendingToken;
            let foundMatch = false;
            let maybeToken: Tokenizable = {label: newToken, value: newToken};

            if (!this.props.possibleTokens) {
                foundMatch = true;
            } else {
                this.props.possibleTokens.forEach((possibleToken: Tokenizable) => {
                    if (possibleToken.label.toLowerCase() == newToken.toLowerCase()) {
                        foundMatch = true;
                        maybeToken = possibleToken;
                    }
                })
            }

            if (foundMatch && !this.tokenAlreadyAdded(maybeToken)) {
                this.appendToken(maybeToken);
            } else {
                // TODO: Do something if we didn't find a matching token.
            }
        }
    }

    removeToken(tokenToRemove: Tokenizable) {
        this.state.tokens = this.state.tokens.filter((token: Tokenizable) => {
            return tokenToRemove.label != token.label
        });
        this.setState(this.state);
        this.props.onChange(this.state.tokens);
    }

    getTokenValues(): Array<Tokenizable>{
        // This function intended to be called via. ref to get the list of tokens.
        // TODO: Decide if we want a call like this to attempt to tokenize whatever is left in
        // pendingToken
        return this.state.tokens
    }

    renderToken(token: Tokenizable, index: number) {
        return (
            <div className="card rendered-token" key={index}>
                {token.label}
                <div className="remove-token"
                     onClick={this.removeToken.bind(this, token)}
                >
                    x
                </div>
            </div>
        )
    }

    renderTokens() {
        if (!this.state.tokens.length) {
           return
        }

        return (
            <div className="tokens-container">
                {this.state.tokens.map(this.renderToken.bind(this))}
            </div>
        )
    }

    shouldHidePendingToken() {
       return this.props.tokenLimit && this.state.tokens.length >= this.props.tokenLimit;
    }

    renderPendingToken() {
        // If we are at the maximum number of tokens, don't render the container
        if (this.shouldHidePendingToken()) {
            return
        }

        return (
            <div className="pending-token-container">
                <input type="text"
                       value={this.state.pendingToken}
                       onChange={this.updatePendingToken.bind(this)}
                       onKeyPress={this.onKeyPress.bind(this)}
                />
            </div>
        )
    }

    renderAutoComplete() {
        if (this.shouldHidePendingToken() || !this.state.autoCompleteTokens.length) {
            return
        }

        return (
            <div className="autocomplete-token-container">
                {this.state.autoCompleteTokens.map((token) => {
                    return <div
                        className="autocomplete-token"
                        key={token.value}
                        onClick={this.onClick.bind(this, token)}
                    >
                        {token.label}
                    </div>
                })}
            </div>
        )
    }

    render() {
        return (
            <div className="tokenizer-container">
                {this.renderTokens()}
                <div className="pending-state-container">
                    {this.renderPendingToken()}
                    {this.renderAutoComplete()}
                </div>
            </div>
        )
    }
}

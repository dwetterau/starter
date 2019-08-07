import * as React from "react";

export interface Tokenizable {
    label: string,
    subtext?: string,
    value: any,
}
export interface TokenizerProps {
    onChange: (tokens: Array<Tokenizable>) => void,
    initialValues?: Array<Tokenizable>, // Note this does not work outside of the first call.
    possibleTokens?: Array<Tokenizable>,
    tokenLimit?: number, // Limit of 0 is the same as unlimited

    // If provided, will be called when the user indicates they are done entering tokens.
    // An example is if they have selected a token and then press "Enter" again without attempting
    // to add another token.
    onExit?: () => void,
}
export interface TokenizerState {
    tokens: Array<Tokenizable>,
    pendingToken: string,
    autoCompleteTokens: Array<Tokenizable>,
    selectedTokenIndex: number,
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
            selectedTokenIndex: -1,
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
        const pendingToken = event.target.value.trim();
        const autoCompleteTokens = this.updateAutoComplete(event.target.value);

        // Update the cursor after the resize
        let selectedTokenIndex = this.state.selectedTokenIndex;
        if (this.state.selectedTokenIndex == null) {
            selectedTokenIndex = -1;
        } else if (this.state.selectedTokenIndex >= this.state.autoCompleteTokens.length) {
            selectedTokenIndex = this.state.autoCompleteTokens.length - 1;
        }

        this.setState({
            pendingToken: pendingToken,
            autoCompleteTokens: autoCompleteTokens,
            selectedTokenIndex: selectedTokenIndex,
        });
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
        const newTokens = this.state.tokens.concat([{
            label: token.label,
            subtext: token.subtext,
            value: token.value,
        }]);
        this.setState({
            tokens: newTokens,
            pendingToken: '',
            autoCompleteTokens: [],
            selectedTokenIndex: -1,
        });

        this.props.onChange(newTokens);
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

            if (this.state.selectedTokenIndex >= 0) {
                // We just selected a token.
                this.appendToken(this.state.autoCompleteTokens[this.state.selectedTokenIndex]);
                return
            }

            // Otherwise, attempt to form a token out of what's in the text box.
            const newToken = this.state.pendingToken;
            let foundMatch = false;
            let maybeToken: Tokenizable = {
                label: newToken,
                value: newToken,
            };

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

    onKeyDown(event: any) {
        if (event.key == "ArrowDown") {
            if (!this.state.autoCompleteTokens.length) {
                return
            }
            this.setState({
                selectedTokenIndex: Math.min(
                    this.state.selectedTokenIndex + 1,
                    this.state.autoCompleteTokens.length - 1,
                ),
            });
        } else if (event.key == "ArrowUp") {
            if (!this.state.autoCompleteTokens.length) {
                return
            }
            this.setState({
                selectedTokenIndex: Math.max(
                    this.state.selectedTokenIndex - 1,
                    0,
                ),
            });
        } else if (event.key == "Enter") {
            if ((this.state.autoCompleteTokens.length > 1 && !this.state.selectedTokenIndex) ||
                    this.state.autoCompleteTokens.length == 1) {
                this.setState({selectedTokenIndex: 0});
                return;
            }
            if (this.state.tokens.length > 0 && this.state.pendingToken.length == 0) {
                if (this.props.onExit) {
                    this.props.onExit()
                }
            }
        }
    }

    removeToken(tokenToRemove: Tokenizable) {
        const newTokens = this.state.tokens.filter((token: Tokenizable) => {
            return tokenToRemove.label != token.label
        });
        this.setState({
            tokens: newTokens,
        });
        this.props.onChange(newTokens);
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
                       onKeyDown={this.onKeyDown.bind(this)}
                />
            </div>
        )
    }

    renderTokenSubtext(token: Tokenizable) {
        if (!token.subtext) {
            return
        }
        return <div className="token-subtext">{token.subtext}</div>
    }

    renderAutoComplete() {
        if (this.shouldHidePendingToken() || !this.state.autoCompleteTokens.length) {
            return
        }

        return (
            <div className="autocomplete-token-container">
                {this.state.autoCompleteTokens.map((token, index) => {
                    let className = "autocomplete-token";
                    if (index == this.state.selectedTokenIndex) {
                        className += " -selected";
                    }

                    return <div
                        className={className}
                        key={token.value}
                        onClick={this.onClick.bind(this, token)}
                    >
                        {token.label}
                        {this.renderTokenSubtext(token)}
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

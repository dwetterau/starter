import * as React from "react";

export interface Tokenizable {
    label: string,
    value: any,
}
export interface TokenizerProps {
    onChange: (tokens: Array<Tokenizable>) => void,
    initialValues?: Array<Tokenizable>, // Note this does not work outside of the first call.
    possibleTokens?: Array<Tokenizable>,
}
export interface TokenizerState {
    tokens: Array<Tokenizable>,
    pendingToken: string,
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
        };
        if (props.initialValues) {
            props.initialValues.forEach((token) => {
                newState.tokens.push(token)
            })
        }
        if (this.state) {
            newState.pendingToken = this.state.pendingToken;
        }

        return newState;
    }

    updatePendingToken(event: any) {
        this.state.pendingToken = event.target.value;
        this.setState(this.state);
    }

    onKeyPress(event: any) {
        if (event.key == "Enter") {
            const newToken = this.state.pendingToken.trim();
            let foundMatch = false;

            if (!this.props.possibleTokens) {
                foundMatch = true;
                this.state.tokens.push({label: newToken, value: newToken});
            } else {
                this.props.possibleTokens.forEach((possibleToken: Tokenizable) => {
                    if (possibleToken.label == newToken) {
                        foundMatch = true;
                        this.state.tokens.push({
                            label: possibleToken.label,
                            value: possibleToken.value,
                        })
                    }
                })
            }

            if (foundMatch) {
                this.state.pendingToken = '';
                this.setState(this.state);

                this.props.onChange(this.state.tokens);
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

    render() {
        return (
            <div className="tokenizer-container">
                {this.renderTokens()}
                <div className="pending-token-container">
                <input type="text"
                       value={this.state.pendingToken}
                       onChange={this.updatePendingToken.bind(this)}
                       onKeyPress={this.onKeyPress.bind(this)}
                />
                </div>
            </div>
        )
    }
}

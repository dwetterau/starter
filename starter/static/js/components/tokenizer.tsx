import * as React from "react";

export interface Tokenizable {
    label: string,
    value: any,
}
export interface TokenizerProps {
    possibleTokens: Array<Tokenizable>,
}
export interface TokenizerState {
    tokens: Array<Tokenizable>,
    pendingToken: string,
}

export class TokenizerComponent extends React.Component<TokenizerProps, TokenizerState> {
    constructor(props: TokenizerProps) {
        super(props);

        this.state = {
            tokens: [],
            pendingToken: '',
        }
    }

    updatePendingToken(event: any) {
        this.state.pendingToken = event.target.value;
        this.setState(this.state);
    }

    getTokenValues(): Array<Tokenizable>{
        // This function intended to be called via. ref to get the list of tokens.
        // TODO: Decide if we want a call like this to attempt to tokenize whatever is left in
        // pendingToken
        return this.state.tokens
    }

    renderToken(token: Tokenizable) {
        return (
            <div className="rendered-token">
                {token.label}
            </div>
        )
    }

    renderTokens() {
        if (!this.state.tokens.length) {
           return
        }

        return (
            <div className="tokens-container">
                {this.state.tokens.map(this.renderToken)}
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
                />
                </div>
            </div>
        )
    }
}

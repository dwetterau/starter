import * as React from "react";

export interface Tokenizable {
    label: string,
    value: any,
}
export interface TokenizerProps {
    onChange: (tokens: Array<Tokenizable>) => void,
    possibleTokens?: Array<Tokenizable>,
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

    onKeyPress(event: any) {
        if (event.key == "Enter") {
            // TODO: actually check with the possibleTokens
            const newToken = this.state.pendingToken.trim();
            this.state.tokens.push({label: newToken, value: newToken});
            this.state.pendingToken = '';
            this.setState(this.state);

            this.props.onChange(this.state.tokens);
        }
    }

    getTokenValues(): Array<Tokenizable>{
        // This function intended to be called via. ref to get the list of tokens.
        // TODO: Decide if we want a call like this to attempt to tokenize whatever is left in
        // pendingToken
        return this.state.tokens
    }

    renderToken(token: Tokenizable, index: number) {
        return (
            <div className="rendered-token" key={index}>
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
                       onKeyPress={this.onKeyPress.bind(this)}
                />
                </div>
            </div>
        )
    }
}

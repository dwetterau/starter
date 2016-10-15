import * as React from "react";

export interface AppProps {prop1: string; prop2: string;}

export class App extends React.Component<AppProps, {}> {
    render() {
        return <div>
            Hello world from django + react + jsx + typescript + webpack!
            <br />
            {this.props.prop1} and the other prop {this.props.prop2}
        </div>
    }
}


import "../css/main.css";
import * as React from "react";
import * as ReactDOM from "react-dom";

import {App, AppProps} from "./components/app";

export default class AppRenderer {
    constructor(props: AppProps) {
        ReactDOM.render(
            <App {...props} />,
            document.getElementById("render-target")
        );
    }
}

// Yes, this is disgusting, but it's the only way to expose this entry point without a
// syntax error from the TS compiler.
eval("window.AppRenderer = AppRenderer;");

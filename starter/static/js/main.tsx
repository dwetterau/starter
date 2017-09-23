import "../css/main.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as jQuery from "jquery";

import {App, AppProps} from "./components/app";
import {CapturerProps, Capturer} from "./components/capturer";

export class AppRenderer {
    constructor(props: AppProps) {
        ReactDOM.render(
            <App {...props} />,
            document.getElementById("render-target")
        );
    }
}

export class CaptureRenderer {
    constructor(props: CapturerProps) {
        ReactDOM.render(
            <Capturer {...props} />,
            document.getElementById("render-target")
        );
    }
}

// CSRF stuff
function getCookie(name: string) {
    let cookieValue = '';
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
var csrfToken = getCookie('csrftoken');

function csrfSafeMethod(method: string) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

jQuery.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrfToken);
        }
    }
});

window['StarterRenderers'] = {AppRenderer, CaptureRenderer};

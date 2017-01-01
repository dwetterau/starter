import "../css/main.css";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {Router, Route, browserHistory} from "react-router"
import * as jQuery from "jquery";

import {App, AppProps, AppViewMode} from "./components/app";

export default class AppRenderer {
    constructor(props: AppProps) {
        ReactDOM.render(
            <Router history={browserHistory}>
                <Route path="/" component={AppRenderer.renderTaskBoard(props)} />
                <Route path="/tasks" component={AppRenderer.renderTaskBoard(props)} />
                <Route path="/cal" component={AppRenderer.renderCalendar(props, false)} />
                <Route path="/cal/day" component={AppRenderer.renderCalendar(props, true)} />
                <Route path="/cal/week" component={AppRenderer.renderCalendar(props, false)} />
                <Route path="/tags" component={AppRenderer.renderTagGraph(props)} />
            </Router>,
            document.getElementById("render-target")
        );
    }

    static renderTaskBoard(props: AppProps) {
        return () => {return <App {...props} viewMode={AppViewMode.taskView} />}
    }

    static renderCalendar(props: AppProps, isDayView: boolean) {
        if (isDayView) {
            return () => {
                return <App {...props} viewMode={AppViewMode.eventView} calendarDayView={true}/>
            }
        }
        return () => {
            return <App {...props} viewMode={AppViewMode.eventView} calendarDayView={false}/>
        }
    }


    static renderTagGraph(props: AppProps) {
        return () => {return <App {...props} viewMode={AppViewMode.tagView} />}
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

// Yes, this is disgusting, but it's the only way to expose this entry point without a
// syntax error from the TS compiler.
eval("window.AppRenderer = AppRenderer;");

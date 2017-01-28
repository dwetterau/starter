import * as React from "react";
import {Link} from "react-router"

import {AppViewMode} from "./app";
import {User} from "../models";

export interface AppHeaderProps {
    meUser: User,
    viewMode: AppViewMode
}

export class AppHeader extends React.Component<AppHeaderProps, {}> {

    renderAccountInfo() {
        return <div className="profile-container">
            {"Logged in as: " + this.props.meUser.username}
        </div>
    }

    renderViewModeSelector() {
        const viewModeToName: {[mode: number]: string} = {};
        viewModeToName[AppViewMode.mergedView] = "Home";
        viewModeToName[AppViewMode.taskView] = "Task Board";
        viewModeToName[AppViewMode.eventView] = "Calendar";
        viewModeToName[AppViewMode.tagView] = "Tag Graph";

        const linkMap: {[mode: number]: string} = {};
        linkMap[AppViewMode.mergedView] = "/";
        linkMap[AppViewMode.taskView] = "/tasks";
        linkMap[AppViewMode.eventView] = "/cal";
        linkMap[AppViewMode.tagView] = "/tags";

        return <div className="view-mode-selector">
            {Object.keys(AppViewMode).map((viewMode: string) => {
                if (!viewModeToName.hasOwnProperty(viewMode)) {
                    return
                }

                let className = "view-mode-option";
                if (+viewMode == this.props.viewMode) {
                    className += " -selected";
                }

                return <Link
                    key={viewMode}
                    className={className}
                    to={linkMap[+viewMode]}
                >
                    {viewModeToName[+viewMode]}
                </Link>
            })}
        </div>
    }

    render() {
        return <div className="header-container">
            <h1 className="header-title">Starter</h1>
            {this.renderAccountInfo()}
            {this.renderViewModeSelector()}
        </div>
    }
}

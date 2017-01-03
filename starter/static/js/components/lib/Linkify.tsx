import * as React from "react";
import * as LinkifyIt from 'linkify-it';
import * as tlds from 'tlds';

const linkify: any = new LinkifyIt();
linkify.tlds(tlds);

interface LinkifyProps {
     className: string,
     component?: any,
     properties?: {},
     urlRegex?: {},
     emailRegex?: {},
}

export class Linkify extends React.Component<LinkifyProps, any> {
    static MATCH = 'LINKIFY_MATCH';

    static defaultProps = {
        className: 'Linkify',
        component: 'a',
        properties: {},
    };

    parseCounter = 0;

    getMatches(string) {
        return linkify.match(string);
    }

    parseString(string) {
        let elements = [];
        if (string === '') {
            return elements;
        }

        const matches = this.getMatches(string);
        if (!matches) {
            return string;
        }

        let lastIndex = 0;
        matches.forEach((match, idx) => {
            // Push the preceding text if there is any
            if (match.index > lastIndex) {
                elements.push(string.substring(lastIndex, match.index));
            }
            // Shallow update values that specified the match
            let props = {href: match.url, key: `parse${this.parseCounter}match${idx}`};
            for (let key in this.props.properties) {
                let val = this.props.properties[key];
                if (val === Linkify.MATCH) {
                    val = match.url;
                }

                props[key] = val;
            }
            elements.push(React.createElement(
                this.props.component,
                props,
                match.text
            ));
            lastIndex = match.lastIndex;
        });

        if (lastIndex < string.length) {
            elements.push(string.substring(lastIndex));
        }

        return (elements.length === 1) ? elements[0] : elements;
    }

    parse(children: any): any {
        let parsed = children;

        if (typeof children === 'string') {
            parsed = this.parseString(children);
        } else if (
            React.isValidElement(children) && (children.type !== 'a') &&
            (children.type !== 'button')
        ) {
            let c: any = children;
            parsed = React.cloneElement(
                c,
                {key: `parse${++this.parseCounter}`},
                this.parse(c.props.children)
            );
        } else if (children instanceof Array) {
            parsed = children.map(child => {
                return this.parse(child);
            });
        }

        return parsed;
    }

    render() {
        this.parseCounter = 0;
        const parsedChildren = this.parse(this.props.children);

        return <span className={this.props.className}>{parsedChildren}</span>;
    }
}

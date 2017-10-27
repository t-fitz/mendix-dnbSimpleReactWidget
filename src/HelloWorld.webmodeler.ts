import { Component, createElement } from "react";
import HelloWorld, { HelloWorldContainerProps } from "./components/HelloWorld";

declare function require(name: string): string;

// tslint:disable-next-line:class-name
export class preview extends Component<HelloWorldContainerProps, {}> {
    render() {
        return createElement(HelloWorld, this.props);
    }
}

export function getPreviewCss() {
    return (
        require("./ui/HelloWorld.scss")
    );
}
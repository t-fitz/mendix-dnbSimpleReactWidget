import { Component, createElement } from "react";

import "../ui/HelloWorld.scss";

//type BootstrapStyle = "primary" | "inverse" | "success" | "info" | "warning" | "danger";

// Default properties that come from Mendix
interface WrapperProps {
    class?: string;
    mxObject: mendix.lib.MxObject; // mendix.lib.MxObject typing referenced in tsconfig.jon (line 11). Typing file from node_modules/mendix-client/index.d.ts
    style?: string;
    readOnly: boolean;
    //bootStyle?: BootstrapStyle
}

// properties defined in HelloWorld.xml
export interface HelloWorldContainerProps extends WrapperProps {
    messageAttribute: string;
    defaultMessage: string;
    onChangeMicroflow: string;
}

// widget state object
interface HelloWorldContainerState {
    myMessage: string;
}

export default class HelloWorld extends Component<HelloWorldContainerProps, HelloWorldContainerState> {
    private subscriptionHandles: number[];
    private subscriptionCallback: (mxObject: mendix.lib.MxObject) => () => void; 

    constructor(props: HelloWorldContainerProps) { // called when component created
        super(props);

        this.state = this.updateValues(props.mxObject);
        this.subscriptionHandles = [];
        this.handleAction = this.handleAction.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.subscriptionCallback = mxObject => () => this.setState(this.updateValues(mxObject));
    }

    render() { // called when component created/updated
        const disabled = !this.props.mxObject; // set as disabled if no mxObject

        // create the component
        return createElement("span", {
            className: this.props.class,
            disabled,
            style: HelloWorld.parseStyle(this.props.style)
        }, this.state.myMessage);
    }

    componentWillReceiveProps(newProps: HelloWorldContainerProps) { // called when component updated (changes to props or state)
        this.resetSubscriptions(newProps.mxObject);
        this.setState(this.updateValues(newProps.mxObject));
    }

    componentWillUnmount() { // called when component removed from DOM
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
    }

    // takes style string and returns an array of style attributes
    public static parseStyle(style = ""): { [key: string]: string } {
        try {
            return style.split(";").reduce<{ [key: string]: string }>((styleObject, line) => {
                const pair = line.split(":");
                if (pair.length === 2) {
                    const name = pair[0].trim().replace(/(-.)/g, match => match[1].toUpperCase());
                    styleObject[name] = pair[1].trim();
                }
                return styleObject;
            }, {});
        } catch (error) {
            // tslint:disable-next-line no-console
            console.log("Failed to parse style", style, error);
        }

        return {};
    }

    // widget onupdate function
    private onUpdate(value: number[]) {
        const { mxObject } = this.props;

        console.log("onUpdate");
        console.log(value);
        console.log(mxObject);
    }

    // update values used in the HelloWorldContainerState
    private updateValues(mxObject: mendix.lib.MxObject): HelloWorldContainerState {

        console.log("updateValue");
        console.log(mxObject);

        var msg: string = this.getValue(this.props.messageAttribute, mxObject, "Hello World");

        return {
            myMessage: msg
        };
    }

    // widget onchange function
    private handleAction(value: number) {

        console.log("onChange");

        if ((value || value === 0) && this.props.mxObject) {
            this.executeMicroflow(this.props.onChangeMicroflow, this.props.mxObject.getGuid());
        }
    }

    // execute onChange microflow
    private executeMicroflow(actionname: string, guid: string) {
        if (actionname) {
            window.mx.ui.action(actionname, {
                error: (error) => window.mx.ui.error(
                    `An error occurred while executing microflow: ${actionname}: ${error.message}`
                ),
                params: {
                    applyto: "selection",
                    guids: [ guid ]
                }
            });
        }
    }

    // reset event subscriptions
    private resetSubscriptions(mxObject?: mendix.lib.MxObject) {
        this.subscriptionHandles.forEach(window.mx.data.unsubscribe);
        this.subscriptionHandles = [];

        if (mxObject) {
            const attributes: string[] = [];
            this.subscriptionHandles = attributes.map(attr => window.mx.data.subscribe({
                attr,
                callback: this.subscriptionCallback(mxObject),
                guid: mxObject.getGuid()
            }));
            this.subscriptionHandles.push(window.mx.data.subscribe({
                callback: this.subscriptionCallback(mxObject),
                guid: mxObject.getGuid()
            }));
        }
    }

    // get string value from an mxObject
    private getValue(attributeName: string, mxObject: mendix.lib.MxObject, defaultValue: string): string {
        if (mxObject && attributeName) {
            if (mxObject.get(attributeName) !== "") {
                return mxObject.get(attributeName).toString();
            }
        }
        return defaultValue;
    }
}

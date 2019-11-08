import _ from 'lodash';
import onChange from 'on-change';
import React, { Component, useEffect, useState } from 'react';


export function ReactStore() {
    const RStore = Store()

    RStore.connect = (subject, WrappedComponent) => {
        return class extends Component {
            constructor(props) {
                super(props);
            }
            componentDidMount() {
                this.listener = RStore.subscribe(subject, () => this.setState({}));
            }
            componentWillUnmount() {
                this.listener.unsubscribe();
            }
            render() {
                return (
                    <WrappedComponent {...this.props} />
                )
            }
        }
    }


    RStore.useStore = (path, defaultValue) => {
        const [state, setState] = useState(RStore.get(path, defaultValue));
        useEffect(() => {
            const listener = RStore.subscribe([path], () => {
                setState(RStore.get(path, defaultValue));
            })
            return () => {
                listener.unsubscribe();
            }
        }, []);
        return [state, value => RStore.set(path, value)];
    }

    return RStore
}




/**
 * @typedef {Object} Observer
 * @prop {Function} subscribe
 * @prop {Function} useReactive
 */
/**
 * @template T
 * @param {T} object
 * @return {T & Observer}
 */
export function ReactiveStore(object) {
    const listeners = [];
    const customListeners = {};

    function notify(path, value, previousValue) {
        _.forEach(listeners, l => l && l(path, value, previousValue));
    }

    function notifyCustom(path, value, previousValue) {
        const keys = _.split(path, ".");
        while (keys.length) {
            const path = _.join(keys, ".");
            const listeners = customListeners[path];
            _.forEach(listeners, l => l && l(path, value, previousValue));
            keys.pop();
        }
    }

    function subscribe(listener, path) {
        if (path) {
            if (!customListeners[path]) customListeners[path] = [];
            customListeners[path].push(listener);
            return {
                unsubscribe() {
                    customListeners[path][listenerIndex - 1] = null;
                }
            };
        }
        const listenerIndex = listeners.push(listener);
        return {
            unsubscribe() {
                listeners[listenerIndex - 1] = null;
            }
        };
    }

    const useReactive = path => {
        const [, setState] = useState({});
        useEffect(() => {
            const listener = subscribe(() => {
                setState({});
            });
            return () => {
                listener.unsubscribe();
            };
        }, []);
        return observer;
    };

    const observer = onChange(
        {
            ...object,
            subscribe,
            useReactive
        },
        function (path, value, previousValue) {
            notify(path, value, previousValue);
            notifyCustom(path, value, previousValue);
        }
    );

    observer.useReactive = useReactive;
    observer.subscribe = subscribe;
    return observer;
}
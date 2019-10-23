import { Store } from 'orsys-store';
import React, { Component } from 'react';


export function ReactStore() {
    const RStore = new Store()

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
        });
        return [state, value => RStore.set(path, value)];
    }

    return RStore
}




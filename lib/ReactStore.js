import { Store } from 'orsys-store';
import React, { Component } from 'react';
export function ReactStore() {
  const RStore = new Store();

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
        return React.createElement(WrappedComponent, this.props);
      }

    };
  };

  return RStore;
}
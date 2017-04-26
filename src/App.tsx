import * as React from 'react';
import {AppState} from './appState';
import CounterPureComponent from './CounterPureComponent';
import CounterStatelessFunctionalComponent from './CounterStatelessFunctionalComponent';

export interface P {
  appState: AppState;
  updateAppState(s: AppState): void;
}

export default class App extends React.Component<P, void> {
  render() {
    return (
      <div>
        <CounterPureComponent
          value={this.props.appState.count}
          increment={this.increment}
        />
        <CounterStatelessFunctionalComponent
          value={this.props.appState.count}
          increment={this.increment}
        />
      </div>
    );
  }

  increment = () => {
    this.props.updateAppState({
      ...this.props.appState,
      count: this.props.appState.count + 1,
    });
  };
}

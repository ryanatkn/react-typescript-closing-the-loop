import * as React from 'react';

export interface P {
  value: number;
  increment(): void;
}

export default class CounterPureComponent extends React.PureComponent<P, void> {
  render(): JSX.Element {
    return (
      <div>
        <div onClick={this.props.increment}>
          {this.props.value}
        </div>
      </div>
    );
  }
}

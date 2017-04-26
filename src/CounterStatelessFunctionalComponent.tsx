import * as React from 'react';

export interface P {
  value: number;
  increment(): void;
}

const CounterStatelessFunctionalComponent = ({
  value,
  increment,
}: P) => {
  return (
    <div>
      <div onClick={increment}>
        {value}
      </div>
    </div>
  );
}

export default CounterStatelessFunctionalComponent;

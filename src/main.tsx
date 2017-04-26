import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import {AppState, getInitialAppState} from './appState';

export default function main(): void {

  let appState = getInitialAppState();

  function updateAppState(nextAppState: AppState): void {
    appState = nextAppState;
    render();
  }

  const root = document.getElementById('root');

  function render() {
    ReactDOM.render(
      <App appState={appState} updateAppState={updateAppState}/>,
      root,
    );
  }

  render();

}

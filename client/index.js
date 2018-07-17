import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import App from './views/App';
import AppState from './store/app-state';

const initialState = window.__INITIAL__STATE__ || {};

console.log('initialState', initialState)

const root = document.getElementById('root');
const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <Component />
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root
  )
}

render(App);

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextAPP = require('./views/App').default; // eslint-disable-line
    render(NextAPP);
  })
}

// let i = 0;

// class Example {
//   static prop = 1; // eslint-disable-line
// }

// console.log(Example.prop); //eslint-disable-line

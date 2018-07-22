import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { lightBlue, pink } from '@material-ui/core/colors'
import App from './views/App';
import AppState from './store/app-state';

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    secondary: pink,
    type: 'light'
  }
})

const initialState = window.__INITIAL__STATE__ || {};

console.log('initialState', initialState)

const root = document.getElementById('root');
const render = (Component) => {
  // const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
  ReactDOM.hydrate(
    <AppContainer>
      <Provider appState={new AppState(initialState.appState)}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    root
  )
}

const createApp = (TheApp) => {
  class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      console.log('main ->app')
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return <TheApp />
    }
  }
  return Main;
}

render(createApp(App));

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextAPP = require('./views/App').default; // eslint-disable-line
    render(createApp(NextAPP));
  })
}

// let i = 0;

// class Example {
//   static prop = 1; // eslint-disable-line
// }

// console.log(Example.prop); //eslint-disable-line

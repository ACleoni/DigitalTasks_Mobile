/** @format */
import React from 'react';
import App from './App';

import { AppRegistry } from 'react-native';

import { name as appName } from './app.json';

import { Provider } from 'react-redux';

import store from './src/redux/store';

const AppContainer = () =>
{
    return (
        <React.Fragment>
            <Provider store={store}>
                <App />
            </Provider>
        </React.Fragment>
    )
}
AppRegistry.registerComponent(appName, () => AppContainer);

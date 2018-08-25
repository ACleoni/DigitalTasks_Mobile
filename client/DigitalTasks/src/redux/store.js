import 
{
    createStore,
    applyMiddleware,
    compose
} from 'redux';

import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initState = {};
const middleware = [thunk];

const devTools = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ 
                                                        && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__() 
                                                        : null

const store = createStore(
    rootReducer,
    initState,
    compose(
        applyMiddleware(...middleware),
        devTools
    )
);

export default store
    
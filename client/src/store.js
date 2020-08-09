import {createStore,applyMiddleware} from 'redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import rootReducer from './reducers'

//creating initial state
const initialState={}

//creating middleware array
const middleware=[thunk]

//creating store 
//first argument->rootReducer
//Second argumrnt->initial state
// third argument->composeWithDevTools
const store=createStore(rootReducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))
export default store
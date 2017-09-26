import { createStore, combineReducers, applyMiddleware,compose} from 'redux'
import editcube from './ducks/editcube'
import ui from './ducks/ui'
import thunk from 'redux-thunk'

const cubeEditApp = combineReducers({
  editcube,
  ui
})

export const store = createStore(
  cubeEditApp,
  compose(
    applyMiddleware(thunk),
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f=>f
  )
);

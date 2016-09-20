import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import Layout from './Layout/Layout.jsx'
import Chat from './Chat/Chat.component.jsx'

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path='/' component={Layout}>
      <IndexRoute component={Chat}/>
    </Route>
  </Router>
), document.getElementById('root'))



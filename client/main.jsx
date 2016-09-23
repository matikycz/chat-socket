/* eslint-disable no-unused-vars */
import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
/* eslint-enable no-unused-vars */

import Layout from './Layout/Layout.jsx'
import Chat from './Chat/Chat.component.jsx'

/* eslint-disable no-undef */
require('./sass/test.scss')
/* eslint-enable no-undef */


ReactDOM.render((
  <Router history={browserHistory}>
    <Route path='/' component={Layout}>
      <IndexRoute component={Chat}/>
    </Route>
  </Router>
), document.getElementById('root'))

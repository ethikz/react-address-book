import React from 'react';
import Router from 'react-router';
var {DefaultRoute, Route} = Router;

import Layout from './layouts';
import Home from '../views/home';
import Contact from '../components/contacts';

var routes = (
  <Route name="app" path="/" handler={ Layout }>
    <Route name="contact" path="contact/:id" handler={ Contact } />
    <DefaultRoute handler={ Home } />
  </Route>
);

module.exports = routes;
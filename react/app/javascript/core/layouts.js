import React from 'react';
import Router from 'react-router';
import { Link } from 'react-router';
import ContactStore from '../stores/ContactStore';

var {RouteHandler} = Router;


var App = React.createClass({
  getInitialState: function () {
    return {
      contacts: ContactStore.getContacts(),
      loading: true
    };
  },

  componentWillMount: function () {
    ContactStore.init();
  },

  componentDidMount: function () {
    ContactStore.addChangeListener(this.updateContacts);
  },

  componentWillUnmount: function () {
    ContactStore.removeChangeListener(this.updateContacts);
  },

  updateContacts: function () {
    if (!this.isMounted()) {
      return;
    }

    this.setState({
      contacts: ContactStore.getContacts(),
      loading: false
    });
  },

  render: function () {
    var contacts = this.state.contacts.map(function ( contact ) {
      return (
        <li key={contact.id}>
          <Link to="contact" params={contact}>{contact.name}</Link>
        </li>
      );
    });
    
    return (
      <div className="contact">
        <div className="contact-list">
          <ul>{contacts}</ul>
        </div>
        <div className="contact-details">
          <RouteHandler/>
        </div>
      </div>
    );
  }
});

module.exports = App;
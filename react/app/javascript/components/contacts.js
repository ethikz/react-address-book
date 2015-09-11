import React from 'react';
import ContactStore from '../stores/ContactStore';


var Contact = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },

  getStateFromStore: function () {
    var id = this.context.router.getCurrentParams().id;
    
    return {
      contact: ContactStore.getContact(id)
    };
  },

  getInitialState: function () {
    return this.getStateFromStore();
  },

  componentDidMount: function () {
    ContactStore.addChangeListener(this.updateContact);
  },

  componentWillUnmount: function () {
    ContactStore.removeChangeListener(this.updateContact);
  },

  componentWillReceiveProps: function () {
    this.setState(this.getStateFromStore());
  },

  updateContact: function () {
    if ( !this.isMounted() ) {
      return;
    }

    this.setState(this.getStateFromStore());
  },

  render: function () {
    var contact = this.state.contact || {};
    var name = contact.name;
    var email = 'mailto:' + name + '@mycompany.com';
    var avatar = contact.avatar || 'http://placecage.com/50/50';
    var title,
        workStartYear,
        workEndYear,
        schoolStartYear,
        schoolEndYear,
        workInstitution,
        schoolInstitution,
        degree;

    console.log(contact.education)

    $.each(contact, function( index, value) {
      title = value[0].title;
      workStartYear = value[0].startYear;
      workEndYear = value[0].endYear;
    });
    
    return (
      <div className="contact">
        <img height="50" src={avatar} key={avatar}/>
        <h3>{name}</h3>
        <div>{title}</div>
        <div>919-555-555</div>
        <div>
          <a href={email}>{email}</a>
        </div>
        <div>{workStartYear}</div>
        <div>{workEndYear}</div>
      </div>
    );
  }
});

module.exports = Contact;
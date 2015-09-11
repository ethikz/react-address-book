jQuery(function ($, undefined) {
  var contactData,
      API_URL = './javascript/api/people.json';
      sortingTemplate = _.template(
        '<div class="contact-sorting button-group button-group--horizontal">' +
          '<div class="button-group__item">' +
            '<a href="#" class="button button--active sort-asc">Asc</a>' +
          '</div>' +
          '<div class="button-group__item">' +
            '<a href="#" class="button sort-desc">Desc</a>' +
          '</div>' +
        '</div>'
      ),
      contactListTemplate = _.template(
        '<div class="contact">' +
          '<a href="#" data-id="{{ contacts.id }}">{{ contacts.name }}</a>' +
        '</div>'
      ),
      contactDetailsTemplate = _.template(
        '<div>' +
          '<img src="{{ contacts.avatar }}" />' +
        '</div>' +
        '<div>{{ contacts.name }}</div>' +
        '<div>{{ contacts.workExperience[0].title }}</div>' +
        '<div>919-555-5555</div>' +
        '<div>' +
          '<a href="mailto:{{ contacts.email }}">{{ contacts.email }}</a>' +
        '</div>' +
        '<div>{{ contacts.education[0].startYear }}</div>' +
        '<div>{{ contacts.education[0].endYear }}</div>'
      ),
      contactGroupTemplate = _.template(
        '<h4>{{ contacts }}</h4>'
      );
  
  function getContacts() {
    getJSONP( API_URL ).then(function( data ) {
      contactData = data;
      return _.valuesIn(contactData);
    }).then(appendContacts);
  }


  // Needs to be refactored so there is only 1 thing happening in this function
  function appendContacts( contacts, sorting ) {
    $('.contact-list').empty();
    
    $('.contact-list').append(sortingTemplate());
    
    contacts = _.sortBy(contacts, 'id');
    
    if ( sorting == 'desc' ) {
      contacts = contacts.reverse();
    }
    
    var groupedContacts = _.groupBy(contacts, function(contact) { 
      return contact.name.substr(0,1); 
    });
    
    _.forEach(groupedContacts, function( contacts, key ) {
      $('.contact-list').append(contactGroupTemplate({contacts: key})).fadeTo('fast', 1);

      _.forEach(contacts, function(contact) {
        $('.contact-list').append(contactListTemplate({contacts: contact})).fadeTo('fasr', 1);
      });
    });

    $(document).on('click', '.contact a', function() {
      $('.contact-details').empty();
      appendContactDetails($(this).attr('data-id'), _.valuesIn(contacts));
    });
  }

  function appendContactDetails( contactId, contacts ) {
    var selectedContact;
    _.forEach( _.valuesIn(contacts), function( k, v ) {
      if ( contactId == k.id) {
        selectedContact = k;
      }
    });

    $('.contact-details').append(contactDetailsTemplate({contacts: selectedContact})).fadeTo('fast', 1);
  }

  if ( $('.contact-list').length > 0 ) {
    getContacts();

    $(document).on('click', '.button-group__item .button', function() {
      if ( $(this).hasClass('sort-desc') ) {
        $('.contact-list').removeClass('sort-asc').addClass('sort-desc');
        appendContacts(contactData, 'desc');
      } else {
        $('.contact-list').removeClass('sort-desc').addClass('sort-asc');
        appendContacts(contactData);
      }
      
      if( $('.contact-list').hasClass('sort-asc') ) {
        $('.button').removeClass('button--active');
        $('.button.sort-asc').addClass('button--active');
      } else {
        $('.button').removeClass('button--active');
        $('.button.sort-desc').addClass('button--active');
      }
    });
  }
});

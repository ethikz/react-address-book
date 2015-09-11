jQuery(function ($, undefined) {
  var contactData,
      API_URL = './javascript/api/people.json';
      sortingTemplate = _.template(
        '<div class="contact-sorting">' +
          '<h6>Sorting</h6>' +
          '<div class="button-group button-group--horizontal">' +
            '<div class="button-group__item">' +
              '<a href="#" class="button button--active sort-asc">A-Z</a>' +
            '</div>' +
            '<div class="button-group__item">' +
              '<a href="#" class="button sort-desc">Z-A</a>' +
            '</div>' +
          '</div>' +
        '</div>'
      ),
      contactListTemplate = _.template(
        '<div class="contact-list__item">' +
          '<a href="#" data-id="{{ contacts.id }}">{{ contacts.name }}</a>' +
        '</div>'
      ),
      contactDetailsTemplate = _.template(
        '<img src="{{ contacts.avatar }}" class="contact-details__img" />' +
        '<div class="contact-details__info">' +
          '<h2>{{ contacts.name }}</h2>' +
          '<p>{{ contacts.workExperience[0].title }}</p>' +
          '<p>919-555-5555</p>' +
          '<a href="mailto:{{ contacts.email }}">{{ contacts.email }}</a>' +
        '</div>' +
        '<div class="contact-education">' +
          '<p class="title">Education</p>' +
          '<div class="contact-education__dates">{{ contacts.education[0].startYear }} - {{ contacts.education[0].endYear }}</div>' +
          '<div class="contact-education__info">' +
            '<h5>{{ contacts.education[0].institution }}</h5>' +
            '<p>{{ contacts.education[0].degree }}</p>' +
          '</div>' +
        '</div>' +
        '<div class="contact-experience">' +
          '<p class="title">Experience</p>' +
          '<div class="contact-experience__dates">{{ contacts.workExperience[0].startYear }} - {{ contacts.workExperience[0].endYear }}</div>' +
          '<div class="contact-experience__info">' +
            '<h5>{{ contacts.workExperience[0].institution }}</h5>' +
            '<p>{{ contacts.workExperience[0].title }}</p>' +
          '</div>' +
        '</div>'
      ),
      contactGroupTemplate = _.template(
        '<p class="contact-sorting__group">{{ contacts }}</p>'
      );
  
  
  function getContacts() {
    getJSONP( API_URL ).then(function( data ) {
      contactData = data;
      return _.valuesIn(contactData);
    }).then(appendContacts);
  }


  // Needs to be refactored
  function appendContacts( contacts, sorting ) {
    $('.contact-list').empty();
    $('.contact-list').append(sortingTemplate());
    
    contacts = _.sortBy(contacts, 'id');
    
    if ( sorting == 'desc' ) {
      contacts = contacts.reverse();
    }
    
    var groupedContacts = _.groupBy(contacts, function( contact ) { 
      return contact.name.substr(0,1); 
    });
    
    _.forEach(groupedContacts, function( contacts, key ) {
      $('.contact-list').append(contactGroupTemplate({
        contacts: key
      })).fadeTo('fast', 1);

      _.forEach(contacts, function( contact ) {
        $('.contact-list').append(contactListTemplate({
          contacts: contact
        })).fadeTo('fasr', 1);
      });
    });

    $(document).on('click', '.contact-list__item a', function() {
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

    $('.contact-details').append(contactDetailsTemplate({
      contacts: selectedContact
    })).fadeTo('fast', 1);
  }

  
  if ( $('.contact-list').length > 0 ) {
    getContacts();

    // Needs to be refactored
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

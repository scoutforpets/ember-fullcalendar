/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-fullcalendar',

  // isDevelopingAddon: function() {
  //   return true;
  // },

  included: function(app) {

    app.import(app.bowerDirectory + '/fullcalendar/dist/fullcalendar.js');
    app.import(app.bowerDirectory + '/fullcalendar/dist/fullcalendar.css');

    // Add scheduler to executable unless configured not to.
    if (!app.options ||
        !app.options.emberFullCalendar ||
        app.options.emberFullCalendar.scheduler === undefined || app.options.emberFullCalendar.scheduler) {
      app.import(app.bowerDirectory + '/fullcalendar-scheduler/dist/scheduler.js');
      app.import(app.bowerDirectory + '/fullcalendar-scheduler/dist/scheduler.css');
    }
  }
};

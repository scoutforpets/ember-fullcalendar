/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-fullcalendar',

  included: function(app) {

    app.import(app.bowerDirectory + '/fullcalendar/dist/fullcalendar.js');
    app.import(app.bowerDirectory + '/fullcalendar/dist/fullcalendar.css');
    app.import(app.bowerDirectory + '/fullcalendar-scheduler/dist/scheduler.js');
    app.import(app.bowerDirectory + '/fullcalendar-scheduler/dist/scheduler.css');
  }
};

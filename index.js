/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-fullcalendar',

  included: function(app) {

    app.import(app.bowerDirectory + '/fullcalendar/dist/fullcalendar.min.js');
    app.import(app.bowerDirectory + '/fullcalendar/dist/fullcalendar.min.css');
    app.import(app.bowerDirectory + '/fullcalendar-scheduler/dist/scheduler.min.js');
    app.import(app.bowerDirectory + '/fullcalendar-scheduler/dist/scheduler.min.css');
  }
};

/* eslint-env node */
'use strict';
const fastbootTransform = require('fastboot-transform');

module.exports = {
  name: 'ember-fullcalendar',

  // isDevelopingAddon: function() {
  //   return true;
  // },

  options: {
    nodeAssets: {
      'fullcalendar': {
        import: {
          include: ['dist/fullcalendar.js', 'dist/fullcalendar.css'],
          processTree(input) {
            return fastbootTransform(input);
          }
        }
      },
      'fullcalendar-scheduler': {
        enabled: this.includeScheduler,
        import: {
          include: ['dist/scheduler.js', 'dist/scheduler.css'],
          processTree(input) {
            return fastbootTransform(input);
          }
        }
      }
    }
  },

  included(app, parentAddon) {

    var target = parentAddon || app;

    // allow addon to be nested - see: https://github.com/ember-cli/ember-cli/issues/3718
    if (target.app) {
      target = target.app;
    }

    var config = target.project.config(target.env) || {};

    // Add scheduler to executable unless configured not to.
    if (config.emberFullCalendar && config.emberFullCalendar.includeScheduler === true) {
      this.includeScheduler = true;
    } else {
      this.includeScheduler = false;
    }

    this._super.included.apply(this, arguments);
  }
};

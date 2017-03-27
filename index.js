/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-fullcalendar',

  // isDevelopingAddon: function() {
  //   return true;
  // },

  options: {
    nodeAssets: {
      'fullcalendar': function() {
        return {
          enabled: !process.env.EMBER_CLI_FASTBOOT,
          srcDir: 'dist',
          import: ['fullcalendar.js', 'fullcalendar.css']
        }
      },
      'fullcalendar-scheduler': function() {
        return {
          enabled: !process.env.EMBER_CLI_FASTBOOT && this.includeScheduler,
          srcDir: 'dist',
          import: ['scheduler.js', 'scheduler.css']
        }
      }
    }
  },

  included: function(app, parentAddon) {

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

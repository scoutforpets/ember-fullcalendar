/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-fullcalendar',

  // isDevelopingAddon: function() {
  //   return true;
  // },

  options: {
    nodeAssets: {
      'fullcalendar': {
        srcDir: 'dist',
        import: ['fullcalendar.js', 'fullcalendar.css']
      },
      'fullcalendar-scheduler': function() {
        return {
          enabled: this.includeScheduler || true,
          srcDir: 'dist',
          import: ['scheduler.js', 'scheduler.css']
        }
      }
    }
  },

  included: function(app) {

    // Add scheduler to executable unless configured not to.
    if (!app.options ||
        !app.options.emberFullCalendar ||
        app.options.emberFullCalendar.scheduler === undefined || app.options.emberFullCalendar.scheduler) {
        this.includeScheduler = false;
    }

    this._super.included.apply(this, arguments);
  }
};

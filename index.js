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
        import: ['fullcalendar.js', 'locale-all.js', 'fullcalendar.css']
      },
      'fullcalendar-scheduler': function() {
        return {
          enabled: this.includeScheduler,
          srcDir: 'dist',
          import: ['scheduler.js', 'locale-all.js', 'scheduler.css']
        }
      }
    }
  },

  included: function(app) {

    // Add scheduler to executable unless configured not to.
    if (!app.options ||
        !app.options.emberFullCalendar ||
        app.options.emberFullCalendar.scheduler === undefined ||
        app.options.emberFullCalendar.scheduler === false) {
        this.includeScheduler = false;
    } else {
      this.includeScheduler = true;
    }


    this._super.included.apply(this, arguments);
  }
};

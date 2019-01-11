/* eslint-env node */
'use strict';

module.exports = {
  name: 'ember-fullcalendar',

  // isDevelopingAddon: function() {
  //   return true;
  // },

  options: {
    nodeAssets: {
    }
  },

  included(app, parentAddon) {
    this._super.included.apply(this, arguments);

    var target = parentAddon || app;

    // allow addon to be nested - see: https://github.com/ember-cli/ember-cli/issues/3718
    if (target.app) {
      target = target.app;
    }

    var config = target.project.config(target.env) || {};

    var plugins = config.emberFullCalendar.plugins || [
      'core',
    ];

    plugins.forEach(plugin => {
      this.import(`node_modules/@fullcalendar/${plugin}/main.css`);
    });

    this._super.included.apply(this, arguments);
  }
};

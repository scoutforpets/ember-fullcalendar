# ember-fullcalendar

[![dependencies](https://david-dm.org/scoutforpets/ember-fullcalendar.svg)](https://david-dm.org/scoutforpets/ember-fullcalendar) [![npm version](https://badge.fury.io/js/ember-fullcalendar.svg)](https://badge.fury.io/js/ember-fullcalendar)


**ember-fullcalendar** brings the power of [FullCalendar](http://fullcalendar.io/) and [FullCalendar Scheduler](http://fullcalendar.io/scheduler/) to Ember.

## Installation

This addon works in Ember 1.13.9+ or 2.0+ with no deprecations.

To install it run:

```ember install ember-fullcalendar```

## Overview
This addon currently supports every option and callback currently available for FullCalendar and FullCalendar Scheduler 4.2. Please see the [FullCalendar documentation](http://fullcalendar.io/docs/) for more information.

## Upgrading

If you upgrade from a previous version of `ember-fullcalendar` using FullCalendar 3.x, note the [FullCalendar v4 release notes and upgrade guide](https://fullcalendar.io/docs/upgrading-from-v3).

To use plugins, you need to pass a `plugins` array to the `full-calendar` component and add any plugins you need to the dependencies of your app. The plugin css must be included by [adding the plugin to your environment.js](#usage).

You no longer need to define `includeLocales` in your environment.js, but instead [import and pass them in the `locales` option](#locales).

Instead of setting `includeScheduler` use the appropriate Scheduler plugins.

## Usage

A simple example:

```javascript
import dayGridPlugin from '@fullcalendar/daygrid';

let events = Ember.A([{
  title: 'Event 1',
  start: '2016-05-05T07:08:08',
  end: '2016-05-05T09:08:08'
}, {
  title: 'Event 2',
  start: '2016-05-06T07:08:08',
  end: '2016-05-07T09:08:08'
}, {
  title: 'Event 3',
  start: '2016-05-10T07:08:08',
  end: '2016-05-10T09:48:08'
}, {
  title: 'Event 4',
  start: '2016-05-11T07:15:08',
  end: '2016-05-11T09:08:08'
}]);

let plugins = [dayGridPlugin];

{{full-calendar events=events plugins=plugins}}
```

### Plugins

The CSS of the plugins you are using must be included by defining them in your `config/environment.js` file:

```javascript
  emberFullCalendar: {
    plugins: ['core', 'daygrid', 'list'],
  }
```

### FullCalendar Methods

To call FullCalendar methods, you need a reference to the calendar object.

A reference gets passed with every FullCalendar callback as last parameter, so you can use e.g. `viewSkeletonRender` to get the object:

```javascript
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    viewSkeletonRender(info, calendar) {
      this.set('calendar', calendar);
    },

    nextMonth() {
      this.calendar.next();
    },
  }
});
```

```handlebars
// app/controllers/application.hbs

{{full-calendar viewSkeletonRender=(action "viewSkeletonRender")}}
```

### DDAU

Where possible, this addon takes advantage of DDAU (Data Down, Actions Up) to allow your Ember app to interact with FullCalendar from outside of the component. Below are a list of properties that override default FullCalendar properties:

- `viewName` _(replaces `defaultView`)_ - allows you to change the view mode from outside of the component. For example, when using `header=false`, you can use your own buttons to modify the `viewName` property to change the view of the calendar.

- `viewRange` - can be used in conjunction with `viewName` to simultaneously navigate to a new date when switching to a new view. [See the docs](https://fullcalendar.io/docs/Calendar-changeView).

- `onViewChange` - pass an action to be notified when the view changes. This is different than the `viewRender` callback provided by FullCalendar as it is only triggered when the view changes and is not when any of the date navigation methods are called.

- `date` _(replaces `defaultDate`)_ - allows you to change the date from outside of the component.

### FullCalendar Callbacks
All FullCalendar and FullCalendar Scheduler callbacks are supported and can be handled using Ember Actions. Here's a simple example:

Add the component to your template:

```handlebars
// app/templates/application.hbs
{{full-calendar events=events eventClick=(action 'clicked')}}
```

Add some events:

```javascript
// app/routes/application.js
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return {
      events: Ember.A([{
        title: 'Partayyyy', start: new Date()
      }])
    };
  }
});
```

Register the action in your controller or component:

```javascript
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    clicked({event, jsEvent, view}){
      this.showModal(event);
    }
  }
});
```

## FullCalendar Scheduler
By default, the addon uses the [Free Trial License Key](http://fullcalendar.io/scheduler/download/) provided by FullCalendar. If you have a paid license key, you may set it by explicitly passing it into the component as `schedulerLicenseKey` or, the better option, is to set it in your `config/environment.js` file like so:

```javascript
var ENV = {
  emberFullCalendar: {
    schedulerLicenseKey: '<your license key>',
  }
  // Other options here, as needed.
};
```

## FullCalendar Locales
To use locales, import and pass them in the `locales` option. [See the docs for more info](https://fullcalendar.io/docs/locale)

## Fastboot Support
This addon now has minimal Fastboot support via #46.

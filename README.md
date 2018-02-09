# ember-fullcalendar

[![dependencies](https://david-dm.org/scoutforpets/ember-fullcalendar.svg)](https://david-dm.org/scoutforpets/ember-fullcalendar) [![npm version](https://badge.fury.io/js/ember-fullcalendar.svg)](https://badge.fury.io/js/ember-fullcalendar)


**ember-fullcalendar** brings the power of [FullCalendar](http://fullcalendar.io/) and [FullCalendar Scheduler](http://fullcalendar.io/scheduler/) to Ember.

## Installation

This addon works in Ember 1.13.9+ or 2.0+ with no deprecations.

To install it run:

```ember install ember-fullcalendar```

## Overview
This addon currently supports every option and callback currently available for FullCalendar 3.6 and FullCalendar Scheduler 1.8. Please see the [FullCalendar documentation](http://fullcalendar.io/docs/) for more information.

## Usage

A simple example:

```javascript
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

{{full-calendar events=events}}
```

### FullCalendar Methods
FullCalendar methods can be called like so:

```javascript
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		nextMonth(){
			Ember.$('.full-calendar').fullCalendar('next');
		}
	}
});
```

### DDAU

Where possible, this addon takes advantage of DDAU (Data Down, Actions Up) to allow your Ember app to interact with FullCalendar from outside of the component. Below are a list of properties that override default FullCalendar properties:

- `viewName` _(replaces `defaultView`)_ - allows you to change the view mode from outside of the component. For example, when using `header=false`, you can use your own buttons to modify the `viewName` property to change the view of the calendar.

- `viewRange` - can be used in conjunction with `viewName` to simultaneously navigate to a new date when switching to a new view. [See the docs](https://fullcalendar.io/docs/views/changeView/).

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
		clicked(event, jsEvent, view){
			this.showModal(event);
		}
	}
});
```

#### Closure Actions
If you prefer closure actions or need to return a value from the callback enable closure actions.

```handlebars
// app/templates/application.hbs
{{full-calendar events=events eventRender=(action 'eventRender') closureactions=true}}
```

```javascript
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
    eventRender(event){
      // render based on some logic
      var render = Math.random() >= .5;
      return render;
    }
	}
});
```

## FullCalendar Scheduler

### Opting In
By default, FullCalendar Scheduler is NOT imported. To include it, add the following to your application's `config/environment.js`:
```javascript
var ENV = {
  emberFullCalendar: {
    includeScheduler: true
  }
  // Other options here, as needed.
});
```

## FullCalendar Locales

By default, only English locale is available. If you need to use other locales, you have to include them in `config/environment.js` like this:
```javascript
var ENV = {
  emberFullCalendar: {
      includeLocales: ['fr', 'it']
  }
  // Other options here, as needed.
});
```

Or, if you need ALL the locales, you can do the following:
```javascript
var ENV = {
  emberFullCalendar: {
      includeLocales: 'all'
  }
  // Other options here, as needed.
});
```

Then, you can set the fullcalendar language by using the `locale` option:

```handlebars
{{full-calendar events=events locale='fr'}}
```

## Fastboot Support
This addon now has minimal Fastboot support via #46.

### License
By default, the addon uses the [Free Trial License Key](http://fullcalendar.io/scheduler/download/) provided by FullCalendar. If you have a paid license key, you may set it by explicitly passing it into the component as `schedulerLicenseKey` or, the better option, is to set it in your `config/environment.js` file like so:

```javascript
	emberFullCalendar: {
		schedulerLicenseKey: '<your license key>'
	}
```

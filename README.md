# ember-fullcalendar

**ember-fullcalendar** brings the power of [FullCalendar](http://fullcalendar.io/) and [FullCalendar Scheduler](http://fullcalendar.io/scheduler/) to Ember.

## Installation

This addon works in Ember 1.13.9+ or 2.0+ with no deprecations.

To install it run:

```ember install ember-fullcalendar```

## Overview
This addon currently supports every option and callback currently available for FullCalendar 2.0. Please see the [FullCalendar documentation](http://fullcalendar.io/docs/) for more information.

*NOTE:* This addon installs both FullCalendar and the new FullCalendar Scheduler addon. While you aren't required to use the Scheduler, it is currently packaged. In the future, there may be an option to disable importing the Scheduler if it's not needed.

## Usage

A simple example:

```handlebars
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

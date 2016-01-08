import Ember from 'ember';
import layout from '../templates/components/full-calendar';
import { InvokeActionMixin } from 'ember-invoke-action';
const { get, isArray, getProperties } = Ember;

export default Ember.Component.extend(InvokeActionMixin, {

  /////////////////////////////////////
  // PROPERTIES
  /////////////////////////////////////

  layout: layout,
  classNames: ['full-calendar'],

  /////////////////////////////////////
  // FULLCALENDAR OPTIONS
  /////////////////////////////////////

  // scheduler defaults to non-commercial license
  schedulerLicenseKey: Ember.computed(function() {

    // load the consuming app's config
    const applicationConfig = this.container.lookupFactory('config:environment'),
          defaultSchedulerLicenseKey = 'CC-Attribution-NonCommercial-NoDerivatives';

    if (applicationConfig &&
        applicationConfig.emberFullCalendar &&
        applicationConfig.emberFullCalendar.schedulerLicenseKey) {
      return applicationConfig.emberFullCalendar.schedulerLicenseKey;
    }

    return defaultSchedulerLicenseKey;
  }),

  fullCalendarOptions: [
    // general display
    'header', 'customButtons', 'buttonIcons', 'theme', 'themeButtonIcons', 'firstDay', 'isRTL', 'weekends', 'hiddenDays',
    'fixedWeekCount', 'weekNumbers', 'weekNumberCalculation', 'businessHours', 'height', 'contentHeight', 'aspectRatio',
    'handleWindowResize', 'eventLimit',

    // timezone
    'timezone', 'now',

    // views
    'views', 'defaultView',

    // agenda options
    'allDaySlot', 'allDayText', 'slotDuration', 'slotLabelFormat', 'slotLabelInterval', 'snapDuration', 'scrollTime',
    'minTime', 'maxTime', 'slotEventOverlap',

    // current date
    'defaultDate',

    // text/time customization
    'lang', 'timeFormat', 'columnFormat', 'titleFormat', 'buttonText', 'monthNames', 'monthNamesShort', 'dayNames',
    'dayNamesShort', 'weekNumberTitle', 'displayEventTime', 'displayEventEnd', 'eventLimitText', 'dayPopoverFormat',

    // selection
    'selectable', 'selectHelper', 'unselectAuto', 'unselectCancel', 'selectOverlap', 'selectConstraint',

    // event data
    'eventSources', 'allDayDefault', 'startParam', 'endParam', 'timezoneParam', 'lazyFetching',
    'defaultTimedEventDuration', 'defaultAllDayEventDuration', 'forceEventDuration',

    // event rendering
    'eventColor', 'eventBackgroundColor', 'eventBorderColor', 'eventTextColor', 'nextDayThreshold', 'eventOrder',

    // event dragging & resizing
    'editable', 'eventStartEditable', 'eventDurationEditable', 'dragRevertDuration', 'dragOpacity', 'dragScroll',
    'eventOverlap', 'eventConstraint',

    // dropping external elements
    'droppable', 'dropAccept',

    // timeline view
    'resourceAreaWidth', 'resourceLabelText', 'resourceColumns', 'slotWidth', 'slotDuration', 'slotLabelFormat',
    'slotLabelInterval', 'snapDuration', 'minTime', 'maxTime', 'scrollTime',

    // resource data
    'resources', 'eventResourceField',

    // resource rendering
    'resourceOrder', 'resourceGroupField', 'resourceGroupText'
  ],

  fullCalendarEvents: [
    // general display
    'viewRender', 'viewDestroy', 'dayRender', 'windowResize',

    // clicking and hovering
    'dayClick', 'eventClick', 'eventMouseover', 'eventMouseout',

    // selection
    'select', 'unselect',

    // event data
    'eventDataTransform', 'loading',

    // event rendering
    'eventRender', 'eventAfterRender', 'eventAfterAllRender', 'eventDestroy',

    // event dragging & resizing
    'eventDragStart', 'eventDragStop', 'eventDrop', 'eventResizeStart', 'eventResizeStop', 'eventResize',

    // dropping external events
    'drop', 'eventReceive',

    // timeline view
    'dayClick',

    // resource data
    'loading',

    // resource rendering
    'resourceText', 'resourceRender'
  ],

  /////////////////////////////////////
  // SETUP/TEARDOWN
  /////////////////////////////////////

  didInsertElement() {

    let options =
      Object.assign(
        this.get('options'),
        this.get('hooks')
      );

    // add the license key for the scheduler
    options.schedulerLicenseKey = this.get('schedulerLicenseKey');

    this.$().fullCalendar(options);

    this._eventsDidChange();
  },

  willDestroyElement() {
    this._eventsWillChange(this.get('events'));
    this.$().fullCalendar('destroy');
  },

  /////////////////////////////////////
  // COMPUTED PROPERTIES
  /////////////////////////////////////

  /**
   * Returns all of the valid Fullcalendar options that
   * were passed into the component.
   */
  options: Ember.computed(function() {

    let fullCalendarOptions = this.get('fullCalendarOptions');
    let options = {};

    fullCalendarOptions.forEach(optionName => {
      if (this.get(optionName) !== undefined) {
        options[optionName] = this.get(optionName);
      }
    });

    return options;
  }),

  /**
   * Returns all of the valid Fullcalendar callback event
   * names that were passed into the component.
   */
  usedEvents: Ember.computed('fullCalendarEvents', function() {
    return this.get('fullCalendarEvents').filter(eventName => {
      let methodName = '_' + eventName;
      return this.get(methodName) !== undefined || this.get(eventName) !== undefined;
    });
  }),

  /**
   * Returns an object that contains a function for each action passed
   * into the component. This object is passed into Fullcalendar.
   */
  hooks: Ember.computed(function() {
    let actions = {};

    this.get('usedEvents').forEach((eventName) => {

      // create an event handler that runs the function inside an event loop.
      actions[eventName] = (...args) => {
        Ember.run.schedule('actions', this, () => {
          this.invokeAction(eventName, ...args, this.$());
        });
      };
    });

    return actions;
  }),

  /**
  * Ember observer triggered before the events property is changed
  * We need to unbind any array observers
  */
  _eventsWillChange(events) {
    if (isArray(events)) {
      events.removeArrayObserver(this, {
        willChange: '_eventsArrayWillChange',
        didChange: '_eventsArrayDidChange'
      });
    }
   //Trigger remove logic
    var len = events ? get(events, 'length') : 0;
    this._eventsArrayWillChange(events, 0, len);
  },

  /**
  * Ember observer triggered when the events property is changed
  * We need to bind an array observer to become notified of its changes
  */
  _eventsDidChange: Ember.observer('events', function() {
    let events = this.get('events');

    //simulate a "beforeObserver"
    if (this._oldEvents !== events ) {
      this._eventsWillChange(this._oldEvents);
      this._oldEvents = events;
    }

    if (isArray(events)) {
      events.addArrayObserver(this, {
        willChange: '_eventsArrayWillChange',
        didChange: '_eventsArrayDidChange'
      });

      var len = events ? get(events, 'length') : 0;
      this._eventsArrayDidChange(events, 0, null, len);
    }
  }),

  /*
  * Triggered before the events array changes
  * Here we process the removed elements
  */
  _eventsArrayWillChange(array, idx, removedCount) {
    let removed = Ember.A();

    for (var i = idx; i < idx + removedCount; i++) {
      removed.pushObject(array.objectAt(i));
    }

    this.$().fullCalendar('removeEvents', eventObject => removed.contains(eventObject.originalObject));
  },

  /*
  * Triggered after the events array changes
  * Here we process the inserted elements
  */
  _eventsArrayDidChange(array, idx, removedCount, addedCount) {
    let added = Ember.A();

    for (var i = idx; i < idx + addedCount; i++) {
      added.pushObject(this.createEventObject(array.objectAt(i)));
    }

    this.$().fullCalendar('addEventSource', added);
  },

  eventObjectProperties: [
    'id', 'title', 'allDay', 'start', 'end', 'url', 'className', 'editable',
    'startEditable', 'durationEditable', 'rendering', 'overlap', 'constraint',
    'source', 'color', 'backgroundColor', 'borderColor', 'textColor'
  ],

  /**
   * Create a wrapper event object to contain
   * the original object. Fullcalendar creates new objects
   * internally, so we can't compare by object reference later.
   * The good thing is that this is overridable.
   */
  createEventObject(data) {
    let eventObject = getProperties(data, ...this.get('eventObjectProperties'));
    eventObject.originalObject = data;
    return eventObject;
  }

});

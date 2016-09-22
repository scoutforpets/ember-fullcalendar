import Ember from 'ember';
import layout from '../templates/components/full-calendar';
import { InvokeActionMixin } from 'ember-invoke-action';
const { get, isArray, getProperties, observer, computed } = Ember;
import getOwner from 'ember-getowner-polyfill';

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
  schedulerLicenseKey: computed(function() {

    // load the consuming app's config
    const applicationConfig = getOwner(this)._lookupFactory('config:environment');
    const defaultSchedulerLicenseKey = 'CC-Attribution-NonCommercial-NoDerivatives';

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
    'handleWindowResize', 'eventLimit', 'weekNumbersWithinDays',

    // clicking & hovering
    'navLinks',

    // timezone
    'timezone', 'now',

    // views
    'views',

    // agenda options
    'allDaySlot', 'allDayText', 'slotDuration', 'slotLabelFormat', 'slotLabelInterval', 'snapDuration', 'scrollTime',
    'minTime', 'maxTime', 'slotEventOverlap',

    // list options
    'listDayFormat', 'listDayAltFormat', 'noEventsMessage',

    // current date
    'nowIndicator',

    // text/time customization
    'locale', 'timeFormat', 'columnFormat', 'titleFormat', 'buttonText', 'monthNames', 'monthNamesShort', 'dayNames',
    'dayNamesShort', 'weekNumberTitle', 'displayEventTime', 'displayEventEnd', 'eventLimitText', 'dayPopoverFormat',

    // selection
    'selectable', 'selectHelper', 'unselectAuto', 'unselectCancel', 'selectOverlap', 'selectConstraint',
    'selectAllow',

    // event data
    'events', 'eventSources', 'allDayDefault', 'startParam', 'endParam', 'timezoneParam', 'lazyFetching',
    'defaultTimedEventDuration', 'defaultAllDayEventDuration', 'forceEventDuration',

    // event rendering
    'eventColor', 'eventBackgroundColor', 'eventBorderColor', 'eventTextColor', 'nextDayThreshold', 'eventOrder',

    // event dragging & resizing
    'editable', 'eventStartEditable', 'eventDurationEditable', 'dragRevertDuration', 'dragOpacity', 'dragScroll',
    'eventOverlap', 'eventConstraint', 'longPressDelay', 'eventAllow',

    // dropping external elements
    'droppable', 'dropAccept',

    // timeline view
    'resourceAreaWidth', 'resourceLabelText', 'resourceColumns', 'slotWidth',

    // resource data
    'resources', 'eventResourceField',

    // resource rendering
    'resourceOrder', 'resourceGroupField', 'resourceGroupText',

    // vertical resource view
    'groupByResource', 'groupByDateAndResource'
  ],

  fullCalendarEvents: [
    // general display
    'viewRender', 'viewDestroy', 'dayRender', 'windowResize',

    // clicking and hovering
    'dayClick', 'eventClick', 'eventMouseover', 'eventMouseout', 'navLinkDayClick', 'navLinkWeekClick',

    // selection
    'select', 'unselect',

    // event data
    'eventDataTransform', 'loading',

    // event rendering
    'eventRender', 'eventAfterRender', 'eventAfterAllRender', 'eventDestroy',
    'eventLimitClick',

    // event dragging & resizing
    'eventDragStart', 'eventDragStop', 'eventDrop', 'eventResizeStart', 'eventResizeStop', 'eventResize',

    // dropping external events
    'drop', 'eventReceive',

    // resource rendering
    'resourceText', 'resourceRender'
  ],

  /////////////////////////////////////
  // SETUP/TEARDOWN
  /////////////////////////////////////

  didInsertElement() {

    const options =
      Object.assign(
        this.get('options'),
        this.get('hooks')
      );

    // Temporary patch for `eventDataTransform` method throwing error
    options.eventDataTransform = this.get('eventDataTransform');

    // add the license key for the scheduler
    options.schedulerLicenseKey = this.get('schedulerLicenseKey');

    this.$().fullCalendar(options);
  },

  willDestroyElement() {
    this.$().fullCalendar('destroy');
  },

  /////////////////////////////////////
  // COMPUTED PROPERTIES
  /////////////////////////////////////

  /**
   * Returns all of the valid Fullcalendar options that
   * were passed into the component.
   */
  options: computed(function() {

    const fullCalendarOptions = this.get('fullCalendarOptions');
    const options = {};

    // Apply FullCalendar options based on property name
    fullCalendarOptions.forEach(optionName => {
      if (this.get(optionName) !== undefined) {
        options[optionName] = this.get(optionName);
      }
    });

    // Handle overriden properties
    if (this.get('viewName') !== undefined) {
      options['defaultView'] = this.get('viewName');
    }

    if (this.get('date') !== undefined) {
      options['defaultDate'] = this.get('date');
    }

    return options;
  }),

  /**
   * Returns all of the valid Fullcalendar callback event
   * names that were passed into the component.
   */
  usedEvents: computed('fullCalendarEvents', function() {
    return this.get('fullCalendarEvents').filter(eventName => {
      const methodName = `_${eventName}`;
      return this.get(methodName) !== undefined || this.get(eventName) !== undefined;
    });
  }),

  /**
   * Returns an object that contains a function for each action passed
   * into the component. This object is passed into Fullcalendar.
   */
  hooks: computed(function() {
    const actions = {};

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


  /////////////////////////////////////
  // OBSERVERS
  /////////////////////////////////////

  /**
   * Observe the events array for any changes and
   * re-render if changes are detected
   */
  observeEvents: observer('events.[]', function () {
     const fc = this.$();
     fc.fullCalendar('removeEvents');
     fc.fullCalendar('addEventSource', this.get('events'));
     fc.fullCalendar('rerenderEvents');
  }),

  /**
   * Observes the 'viewName' property allowing FullCalendar view to be
   * changed from outside of the component.
   */
  viewNameDidChange: Ember.observer('viewName', function() {
    const viewName = this.get('viewName');
    this.$().fullCalendar('changeView', viewName);
  }),

  /**
   * Observes `date` property allowing date to be changed from outside
   * of the component.
   */
  dateDidChange: Ember.observer('date', function() {
    let date = this.get('date');
    this.$().fullCalendar('gotoDate', date);
  })

});

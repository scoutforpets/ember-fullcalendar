import Ember from 'ember';
import layout from '../templates/components/full-calendar';
import {InvokeActionMixin} from 'ember-invoke-action';
const {Component, computed, observer, run} = Ember;

export default Component.extend(InvokeActionMixin, {

  /////////////////////////////////////
  // PROPERTIES
  /////////////////////////////////////

  layout: layout,
  classNames: ['full-calendar'],

  /////////////////////////////////////
  // FULLCALENDAR OPTIONS
  /////////////////////////////////////

  // scheduler defaults to non-commercial license
  schedulerLicenseKey: computed(function () {

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
    'events', 'eventSources', 'allDayDefault', 'startParam', 'endParam', 'timezoneParam', 'lazyFetching',
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

    return this.$().fullCalendar(options);
  },

  /////////////////////////////////////
  // COMPUTED PROPERTIES
  /////////////////////////////////////

  /**
   * Returns all of the valid Fullcalendar options that
   * were passed into the component.
   */
  options: computed(function () {

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
  usedEvents: computed('fullCalendarEvents', function () {
    return this.get('fullCalendarEvents').filter(eventName => {
      let methodName = '_' + eventName;
      return this.get(methodName) !== undefined || this.get(eventName) !== undefined;
    });
  }),

  updateEvents: observer('events.[]', function () {
    const fullCalendarElement = this.$();
    fullCalendarElement.fullCalendar('removeEvents');
    fullCalendarElement.fullCalendar('addEventSource', this.get('events'));
    fullCalendarElement.fullCalendar('rerenderEvents');
  }),

  /**
   * Returns an object that contains a function for each action passed
   * into the component. This object is passed into Fullcalendar.
   */
  hooks: computed(function () {
    let actions = {};

    this.get('usedEvents').forEach((eventName) => {

      // create an event handler that runs the function inside an event loop.
      actions[eventName] = (...args) => {
        run.schedule('actions', this, () => {
          this.invokeAction(eventName, ...args, this.$());
        });
      };
    });

    return actions;
  })

});

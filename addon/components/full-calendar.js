import Ember from 'ember';
import layout from '../templates/components/full-calendar';
import { InvokeActionMixin } from 'ember-invoke-action';

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
  schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',

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
        this.get('actions')
      );

    // add the license key for the scheduler
    options.schedulerLicenseKey = this.get('schedulerLicenseKey');

    return Ember.$('.full-calendar')
      .fullCalendar(options);
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
  actions: Ember.computed(function() {
    let actions = {};

    this.get('usedEvents').forEach((eventName) => {

      // create an event handler that runs the function inside an event loop.
      actions[eventName] = (...args) => {
        Ember.run.schedule('actions', this, () => {
          this.invokeAction(eventName, ...args);
        });
      };
    });

    return actions;
  })

});

import Ember from 'ember';
import {moduleForComponent, test} from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';

let getEventsArray = () => {
  return Ember.A([{
    title: 'Event 1',
    start: moment({day: 5, hour: 7, minute: 8, second: 8}),
    end: moment({day: 5, hour: 9, minute: 8, second: 8})
  }, {
    title: 'Event 2',
    start: moment({day: 6, hour: 7, minute: 8, second: 8}),
    end: moment({day: 6, hour: 9, minute: 8, second: 8})
  }, {
    title: 'Event 3',
    start: moment({day: 10, hour: 7, minute: 8, second: 8}),
    end: moment({day: 10, hour: 9, minute: 48, second: 8})
  }, {
    title: 'Event 4',
    start: moment({day: 11, hour: 7, minute: 15, second: 8}),
    end: moment({day: 11, hour: 9, minute: 8, second: 8})
  }]);
};

moduleForComponent('full-calendar', 'Integration | Component | full calendar', {
  integration: true
});

test('it renders', function (assert) {

  this.render(hbs`{{full-calendar}}`);

  assert.equal(this.$('.ember-view.full-calendar').length, 1);
});

test('it renders events', function (assert) {

  this.set('eventsArray', getEventsArray());

  this.render(hbs`{{full-calendar events=eventsArray}}`);

  assert.equal(this.$('.fc-title').length, 4);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 3Event 4');
});

test('replacing events rerenders events', function (assert) {

  let eventsArray = getEventsArray();

  this.set('eventsArray', eventsArray);

  this.render(hbs`{{full-calendar events=eventsArray}}`);

  assert.equal(this.$('.fc-title').length, 4);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 3Event 4');

  this.set('eventsArray', Ember.A([{
    title: 'New Event 1',
    start: moment({day: 5, hour: 7, minute: 8, second: 8}),
    end: moment({day: 5, hour: 9, minute: 8, second: 8})
  }, {
    title: 'New Event 2',
    start: moment({day: 6, hour: 7, minute: 8, second: 8}),
    end: moment({day: 7, hour: 9, minute: 8, second: 8})
  }]));

  assert.equal(this.$('.fc-title').length, 2);
  assert.equal(this.$('.fc-title').text().trim(), 'New Event 1New Event 2');
});

test('set events to null removes events', function (assert) {

  let eventsArray = getEventsArray();

  this.set('eventsArray', eventsArray);

  this.render(hbs`{{full-calendar events=eventsArray}}`);

  assert.equal(this.$('.fc-title').length, 4);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 3Event 4');

  this.set('eventsArray', null);

  assert.equal(this.$('.fc-title').length, 0);
});

test('it removes events', function (assert) {

  let eventsArray = getEventsArray();

  this.set('eventsArray', eventsArray);

  this.render(hbs`{{full-calendar events=eventsArray}}`);

  assert.equal(this.$('.fc-title').length, 4);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 3Event 4');

  eventsArray.removeAt(2);

  assert.equal(this.$('.fc-title').length, 3);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 4');

});

test('it adds events', function (assert) {

  let eventsArray = getEventsArray();

  this.set('eventsArray', eventsArray);

  this.render(hbs`{{full-calendar events=eventsArray}}`);

  assert.equal(this.$('.fc-title').length, 4);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 3Event 4');

  eventsArray.insertAt(2, {
    title: 'New Event',
    start: moment({day: 15, hour: 7, minute: 8, second: 8}),
    end: moment({day: 15, hour: 9, minute: 8, second: 8})
  });

  assert.equal(this.$('.fc-title').length, 5);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 3Event 4New Event');

});

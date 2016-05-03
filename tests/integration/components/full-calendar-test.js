import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

let getEventsArray = () => {
  return Ember.A([{
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
};

moduleForComponent('full-calendar', 'Integration | Component | full calendar', {
  integration: true
});

test('it renders', function(assert) {

  this.render(hbs`{{full-calendar}}`);

  assert.equal(this.$('.ember-view.full-calendar').length, 1);
});

test('it renders events', function(assert) {

  this.set('eventsArray', getEventsArray());

  this.render(hbs`{{full-calendar events=eventsArray}}`);

  assert.equal(this.$('.fc-title').length, 4);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 3Event 4');
});

test('replacing events rerenders events', function(assert) {

  let eventsArray = getEventsArray();

  this.set('eventsArray', eventsArray);

  this.render(hbs`{{full-calendar events=eventsArray}}`);

  assert.equal(this.$('.fc-title').length, 4);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 3Event 4');

  this.set('eventsArray', Ember.A([{
   title: 'New Event 1',
   start: '2016-05-05T07:08:08',
   end: '2016-05-05T09:08:08'
  }, {
   title: 'New Event 2',
   start: '2016-05-06T07:08:08',
   end: '2016-05-07T09:08:08'
  }]));

  assert.equal(this.$('.fc-title').length, 2);
  assert.equal(this.$('.fc-title').text().trim(), 'New Event 1New Event 2');
});

test('set events to null removes events', function(assert) {

  let eventsArray = getEventsArray();

  this.set('eventsArray', eventsArray);

  this.render(hbs`{{full-calendar events=eventsArray}}`);

  assert.equal(this.$('.fc-title').length, 4);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 3Event 4');

  this.set('eventsArray', null);

  assert.equal(this.$('.fc-title').length, 0);
});

test('it removes events', function(assert) {

  let eventsArray = getEventsArray();

  this.set('eventsArray', eventsArray);

  this.render(hbs`{{full-calendar events=eventsArray}}`);

  assert.equal(this.$('.fc-title').length, 4);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 3Event 4');

  eventsArray.removeAt(2);

  assert.equal(this.$('.fc-title').length, 3);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 4');

});

test('it adds events', function(assert) {

  let eventsArray = getEventsArray();

  this.set('eventsArray', eventsArray);

  this.render(hbs`{{full-calendar events=eventsArray}}`);

  assert.equal(this.$('.fc-title').length, 4);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 3Event 4');

  eventsArray.insertAt(2, {
    title: 'New Event',
    start: '2016-05-15T07:08:08',
    end: '2016-05-15T09:08:08'
  });

  assert.equal(this.$('.fc-title').length, 5);
  assert.equal(this.$('.fc-title').text().trim(), 'Event 1Event 2Event 3Event 4New Event');

});

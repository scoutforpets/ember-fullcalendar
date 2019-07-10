import Ember from 'ember';
import { module, test, skip } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import { find, findAll, render } from 'ember-test-helpers';
import dayGridPlugin from '@fullcalendar/daygrid';
import resourceDayGridPlugin from '@fullcalendar/resource-daygrid';
import { setupRenderingTest } from 'ember-qunit';

let getEventsArray = () => {
  return Ember.A([{
    title: 'Event 1',
    start: moment({day: 5, hour: 7, minute: 8, second: 8}).toDate(),
    end: moment({day: 5, hour: 9, minute: 8, second: 8}).toDate()
  }, {
    title: 'Event 2',
    start: moment({day: 6, hour: 7, minute: 8, second: 8}).toDate(),
    end: moment({day: 6, hour: 9, minute: 8, second: 8}).toDate()
  }, {
    title: 'Event 3',
    start: moment({day: 10, hour: 7, minute: 8, second: 8}).toDate(),
    end: moment({day: 10, hour: 9, minute: 48, second: 8}).toDate()
  }, {
    title: 'Event 4',
    start: moment({day: 11, hour: 7, minute: 15, second: 8}).toDate(),
    end: moment({day: 11, hour: 9, minute: 8, second: 8}).toDate()
  }]);
};

let concatTextContent = selector => {
  return findAll(selector)
    .reduce((string, element) => string + element.textContent.trim(), '')
};

module('Integration | Component | full calendar', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.plugins = [dayGridPlugin];
  });

  test('it renders', async function (assert) {
    await render(hbs`{{full-calendar plugins=plugins}}`);

    assert.ok(find('.ember-view.full-calendar'));
  });

  test('it renders events', async function (assert) {
    this.set('eventsArray', getEventsArray());

    await render(hbs`{{full-calendar plugins=plugins events=eventsArray}}`);

    assert.equal(findAll('.fc-title').length, 4);
    assert.equal(concatTextContent('.fc-title'), 'Event 1Event 2Event 3Event 4');
  });

  test('replacing events rerenders events', async function (assert) {
    let eventsArray = getEventsArray();

    this.set('eventsArray', eventsArray);

    await render(hbs`{{full-calendar plugins=plugins events=eventsArray}}`);

    assert.equal(findAll('.fc-title').length, 4);
    assert.equal(concatTextContent('.fc-title'), 'Event 1Event 2Event 3Event 4');

    this.set('eventsArray', Ember.A([{
      title: 'New Event 1',
      start: moment({ day: 5, hour: 7, minute: 8, second: 8 }).toDate(),
      end: moment({ day: 5, hour: 9, minute: 8, second: 8 }).toDate()
    }, {
      title: 'New Event 2',
      start: moment({ day: 6, hour: 7, minute: 8, second: 8 }).toDate(),
      end: moment({ day: 6, hour: 9, minute: 8, second: 8 }).toDate()
    }]));

    assert.equal(findAll('.fc-title').length, 2);
    assert.equal(concatTextContent('.fc-title'), 'New Event 1New Event 2');
  });

  test('set events to empty array removes events', async function (assert) {
    let eventsArray = getEventsArray();

    this.set('eventsArray', eventsArray);

    await render(hbs`{{full-calendar plugins=plugins events=eventsArray}}`);

    assert.equal(findAll('.fc-title').length, 4);
    assert.equal(concatTextContent('.fc-title'), 'Event 1Event 2Event 3Event 4');

    this.set('eventsArray', []);

    assert.equal(findAll('.fc-title').length, 0);
  });

  test('it removes events', async function (assert) {
    let eventsArray = getEventsArray();

    this.set('eventsArray', eventsArray);

    await render(hbs`{{full-calendar plugins=plugins events=eventsArray}}`);

    assert.equal(findAll('.fc-title').length, 4);
    assert.equal(concatTextContent('.fc-title'), 'Event 1Event 2Event 3Event 4');

    eventsArray.removeAt(2);

    assert.equal(findAll('.fc-title').length, 3);
    assert.equal(concatTextContent('.fc-title'), 'Event 1Event 2Event 4');
  });

  test('it adds events', async function (assert) {
    let eventsArray = getEventsArray();

    this.set('eventsArray', eventsArray);

    await render(hbs`{{full-calendar plugins=plugins events=eventsArray}}`);

    assert.equal(findAll('.fc-title').length, 4);
    assert.equal(concatTextContent('.fc-title'), 'Event 1Event 2Event 3Event 4');

    eventsArray.insertAt(2, {
      title: 'New Event',
      start: moment({ day: 15, hour: 7, minute: 8, second: 8 }).toDate(),
      end: moment({ day: 15, hour: 9, minute: 8, second: 8 }).toDate()
    });

    assert.equal(findAll('.fc-title').length, 5);
    assert.equal(concatTextContent('.fc-title'), 'Event 1Event 2Event 3Event 4New Event');
  });

  skip('it supports changes in resources array', async function (assert) {
    let resourcesArray = Ember.A([
      {
        id: 'a',
        title: 'Room A',
      }
    ]);

    this.set('resourcesArray', resourcesArray);

    this.plugins.push(resourceDayGridPlugin);

    await render(hbs`{{full-calendar defaultView="resourceDayGridDay" plugins=plugins resources=resourcesArray}}`);

    assert.equal(findAll('.fc-resource-cell').length, 1);
    assert.equal(find('.fc-resource-cell').textContent, 'Room A');

    resourcesArray.insertAt(0, {id: 'b', title: 'Room B'});

    assert.equal(findAll('.fc-resource-cell').length, 2);
    assert.equal(concatTextContent('.fc-resource-cell'), 'Room BRoom A');
  });

  test('it supports changes in eventSources array', async function (assert) {
    let eventSourcesArray = Ember.A([
      {
        events: [{
          title: 'Event 1',
          start: moment({ day: 5, hour: 7, minute: 8, second: 8 }).toDate(),
          end: moment({ day: 5, hour: 9, minute: 8, second: 8 }).toDate()
        }],
      },
    ]);

    this.set('eventSourcesArray', eventSourcesArray);

    await render(hbs`{{full-calendar plugins=plugins eventSources=eventSourcesArray}}`);

    assert.equal(findAll('.fc-title').length, 1);

    eventSourcesArray.pushObject([{
      title: 'Event 2',
      start: moment({ day: 6, hour: 7, minute: 8, second: 8 }).toDate(),
      end: moment({ day: 6, hour: 9, minute: 8, second: 8 }).toDate()
    }]);

    assert.equal(findAll('.fc-title').length, 2);
    assert.equal(concatTextContent('.fc-title'), 'Event 1Event 2');
  });

  test('it supports change of viewName property', async function (assert) {
    this.set('viewName', 'dayGridDay');

    await render(hbs`{{full-calendar plugins=plugins viewName=viewName}}`);

    assert.equal(findAll('.fc-day').length, 1);

    this.set('viewName', 'dayGridWeek');

    assert.equal(findAll('.fc-day').length, 7);
  });

  test('it supports change of date property', async function (assert) {
    this.set('date', '2019-07-01');

    await render(hbs`{{full-calendar defaultView="dayGridDay" plugins=plugins date=date}}`);

    assert.equal(find('.fc-day-header').textContent, 'Monday');

    this.set('date', '2019-07-02');

    assert.equal(find('.fc-day-header').textContent, 'Tuesday');
  });
});

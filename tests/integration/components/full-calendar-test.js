import Ember from 'ember';
import { module, test } from 'qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
import { find, findAll, render } from 'ember-test-helpers';
import dayGridPlugin from '@fullcalendar/daygrid';
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
      end: moment({ day: 7, hour: 9, minute: 8, second: 8 }).toDate()
    }]));

    assert.equal(findAll('.fc-title').length, 2);
    assert.equal(concatTextContent('.fc-title'), 'New Event 1New Event 2');
  });

  test('set events to null removes events', async function (assert) {
    let eventsArray = getEventsArray();

    this.set('eventsArray', eventsArray);

    await render(hbs`{{full-calendar plugins=plugins events=eventsArray}}`);

    assert.equal(findAll('.fc-title').length, 4);
    assert.equal(concatTextContent('.fc-title'), 'Event 1Event 2Event 3Event 4');

    this.set('eventsArray', null);

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
});

import Ember from 'ember';

export default Ember.Controller.extend({
  viewName: 'agendaWeek',
  actions: {
    changeView(viewName) {
      this.set('viewName', viewName);
    }
  }
});
module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;
    return this.addBowerPackageToProject('fullcalendar', '^2.7.3').then(function() {
      return self.addBowerPackageToProject('fullcalendar-scheduler', '^1.3.2');
    });
  }
};

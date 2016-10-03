module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    var self = this;
    return this.addBowerPackageToProject('fullcalendar', '^3.0.0').then(function() {
      return self.addBowerPackageToProject('fullcalendar-scheduler', '^1.4.0');
    });
  }
};

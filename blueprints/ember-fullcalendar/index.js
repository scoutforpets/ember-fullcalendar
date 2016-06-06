module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackageToProject('fullcalendar', '^2.7.3').then(function () {
      return this.addBowerPackageToProject('fullcalendar-scheduler', '^1.3.2');
    });
  }
};

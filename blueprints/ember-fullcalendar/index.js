module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return addBowerPackageToProject('fullcalendar', '^2.7.3').then(function () {
      return addBowerPackageToProject('fullcalendar-scheduler', '^1.3.2');
    });
  }
};

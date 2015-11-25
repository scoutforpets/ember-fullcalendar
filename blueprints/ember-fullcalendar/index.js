module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackageToProject('fullcalendar').then(() => {
      return this.addBowerPackageToProject('fullcalendar-scheduler').then(() => {
        return this.addAddonToProject('ember-cli-moment-shim', '0.6.2');
      });
    });
  }
};

function startup(params, aReason) {
  if (Services.vc.compare(Services.appinfo.platformVersion, "10.0") < 0)
    Components.manager.addBootstrappedManifestLocation(params.installPath);
}

function shutdown(params, aReason) {
  if (Services.vc.compare(Services.appinfo.platformVersion, "10.0") < 0)
    Components.manager.removeBootstrappedManifestLocation(params.installPath);
}
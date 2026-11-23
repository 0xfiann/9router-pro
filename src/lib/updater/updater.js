// The npm updater is disabled in this fork. This script used to spawn
// `npm i -g <pkg>@latest` as a detached process; updates now ship as git
// deployments from this repo. Running it directly does nothing.
console.log("[updater] The npm updater is disabled in this fork. Deploy from git instead.");
process.exit(0);

// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DEPLOY_DIR = path.join(ROOT, "deploy");
const AZURE_DEPLOY = path.join(DEPLOY_DIR, "azuredeploy.json");
const AZURE_DEPLOY_EXISTING = path.join(
  DEPLOY_DIR,
  "azuredeployexistingresource.json"
);
const AZURE_DEPLOY_EDITABLE = path.join(DEPLOY_DIR, "editableazuredeploy.json");
const gitTag = process.argv[0];

function setPackageUrl(armTemplate) {
  const updatedPackageUrl = `https://github.com/Azure-Samples/communication-services-virtual-visits-js/releases/download/${gitTag}/sample.zip`;
  const parsed = JSON.parse(fs.readFileSync(armTemplate));
  parsed.variables.packageurl = updatedPackageUrl;
}

function main() {
  setPackageUrl(AZURE_DEPLOY);
  setPackageUrl(AZURE_DEPLOY_EXISTING);
  setPackageUrl(AZURE_DEPLOY_EDITABLE);
}

main();

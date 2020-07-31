"use strict";

var _tsyringe = require("tsyringe");

var _upload = _interopRequireDefault(require("../../../../config/upload"));

var _DiskImplementationProvider = _interopRequireDefault(require("./implementations/DiskImplementationProvider"));

var _S3ImplementationProvider = _interopRequireDefault(require("./implementations/S3ImplementationProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const providers = {
  disk: _DiskImplementationProvider.default,
  s3: _S3ImplementationProvider.default
};

_tsyringe.container.registerSingleton('StorageProvider', providers[_upload.default.driver]);
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  driver: process.env.MAIL_DRIVER || 'ethereal',
  default: {
    from: {
      email: 'vinicius@develitt.com',
      name: 'Equipe Develitt'
    }
  }
};
exports.default = _default;
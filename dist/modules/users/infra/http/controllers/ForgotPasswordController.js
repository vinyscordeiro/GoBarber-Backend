"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ResetForgotPasswordService = _interopRequireDefault(require("../../../services/ResetForgotPasswordService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ForgotPasswordController {
  async create(request, response) {
    const {
      email
    } = request.body;

    const resetForgotPasswordEmail = _tsyringe.container.resolve(_ResetForgotPasswordService.default);

    await resetForgotPasswordEmail.execute({
      email
    });
    return response.status(204).json();
  }

}

var _default = ForgotPasswordController;
exports.default = _default;
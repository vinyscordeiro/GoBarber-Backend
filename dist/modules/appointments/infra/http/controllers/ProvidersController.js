"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _classTransformer = require("class-transformer");

var _ListProvidersService = _interopRequireDefault(require("../../../services/ListProvidersService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProvidersController {
  async index(request, response) {
    const user_id = request.user.id;

    const listProvider = _tsyringe.container.resolve(_ListProvidersService.default);

    const providers = await listProvider.execute({
      user_id
    });
    return response.json((0, _classTransformer.classToClass)(providers));
  }

}

var _default = ProvidersController;
exports.default = _default;
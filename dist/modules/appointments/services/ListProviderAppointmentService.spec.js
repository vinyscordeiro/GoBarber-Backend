"use strict";

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _FakeAppointmentRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentRepository"));

var _ListProviderAppointmentService = _interopRequireDefault(require("./ListProviderAppointmentService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeAppointmentsRepository;
let listProviderAppointment;
let fakeCacheProvider;
describe('ListProviderAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    listProviderAppointment = new _ListProviderAppointmentService.default(fakeAppointmentsRepository, fakeCacheProvider);
  });
  it('Should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 7, 20, 8, 0, 0),
      user_id: 'user'
    });
    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 7, 20, 9, 0, 0),
      user_id: 'user'
    });
    const appointments = await listProviderAppointment.execute({
      provider_id: 'provider',
      year: 2020,
      month: 8,
      day: 20
    });
    expect(appointments).toEqual([appointment1, appointment2]);
  });
});
"use strict";

var _FakeNotificationsRepository = _interopRequireDefault(require("../../notifications/infra/typeorm/repositories/fakes/FakeNotificationsRepository"));

var _FakeAppointmentRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _CreateAppointmentService = _interopRequireDefault(require("./CreateAppointmentService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeNotificationRepository;
let fakeAppointmentRepository;
let fakeCacheProvider;
let createAppointment;
describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeNotificationRepository = new _FakeNotificationsRepository.default();
    fakeAppointmentRepository = new _FakeAppointmentRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    createAppointment = new _CreateAppointmentService.default(fakeAppointmentRepository, fakeNotificationRepository, fakeCacheProvider);
  });
  it('Should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: '112233445566',
      provider_id: '123456'
    });
    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123456');
  });
  it('Should not be able to create two appointments at the same time', async () => {
    const appointmentDate = new Date(2020, 7, 10, 15);
    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123456',
      user_id: '112233445566'
    });
    await expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '123456',
      user_id: '112233445566'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('Should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      provider_id: '123456',
      user_id: '112233445566'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('Should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      provider_id: '123456',
      user_id: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('Should not be able to create an appointment outside the available schedule', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });
    await expect(createAppointment.execute({
      date: new Date(2020, 4, 11, 7),
      provider_id: '123456',
      user_id: '1234567'
    })).rejects.toBeInstanceOf(_AppError.default);
    await expect(createAppointment.execute({
      date: new Date(2020, 4, 11, 18),
      provider_id: '123456',
      user_id: '1234567'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});
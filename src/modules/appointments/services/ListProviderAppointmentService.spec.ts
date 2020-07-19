import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentRepository';
import ListProviderAppointmentService from './ListProviderAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointment: ListProviderAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointment = new ListProviderAppointmentService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });
  it('Should be able to list the appointments on a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 7, 20, 8, 0, 0),
      user_id: 'user',
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 7, 20, 9, 0, 0),
      user_id: 'user',
    });

    const appointments = await listProviderAppointment.execute({
      provider_id: 'provider',
      year: 2020,
      month: 8,
      day: 20,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });
});

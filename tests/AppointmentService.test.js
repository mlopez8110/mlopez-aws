"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AppointmentService_1 = require("../src/application/AppointmentService");
describe('AppointmentService', () => {
    it('creates appointment and publishes', async () => {
        const mockRepo = {
            save: jest.fn().mockResolvedValue(undefined)
        };
        const mockPublisher = {
            publish: jest.fn().mockResolvedValue(undefined)
        };
        const service = new AppointmentService_1.AppointmentService(mockRepo, mockPublisher);
        const input = { insuredId: '00001', scheduleId: 100, countryISO: 'PE' };
        const appointment = await service.createAppointment(input);
        expect(mockRepo.save).toHaveBeenCalled();
        expect(mockPublisher.publish).toHaveBeenCalled();
        expect(appointment.status).toBe('pending');
        expect(appointment.insuredId).toBe('00001');
    });
    it('rejects invalid insuredId', async () => {
        const mockRepo = { save: jest.fn() };
        const mockPublisher = { publish: jest.fn() };
        const service = new AppointmentService_1.AppointmentService(mockRepo, mockPublisher);
        await expect(service.createAppointment({ insuredId: '12', scheduleId: 1, countryISO: 'PE' })).rejects.toThrow();
    });
});

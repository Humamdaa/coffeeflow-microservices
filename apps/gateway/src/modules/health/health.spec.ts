import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('gateway health', () => {
  it('returns the expected liveness contract', async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService],
    }).compile();

    const controller = moduleRef.get(HealthController);
    expect(controller.getLiveness()).toEqual({ status: 'ok', service: 'gateway' });
    await moduleRef.close();
  });
});

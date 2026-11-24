import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getLiveness(): { status: 'ok'; service: string } {
    return { status: 'ok', service: 'gateway' };
  }
}

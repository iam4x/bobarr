import { Controller, Get } from '@nestjs/common';

import {
  HealthCheckService,
  DNSHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
  public constructor(
    private health: HealthCheckService,
    private dns: DNSHealthIndicator
  ) {}

  @Get()
  @HealthCheck()
  public check() {
    return this.health.check([
      () => this.dns.pingCheck('tmdb', 'https://www.themoviedb.org/'),
    ]);
  }
}

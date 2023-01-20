import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { environment } from 'src/config/development.env';

@Injectable()
export class ConfigurationsService {
  constructor(
    private readonly redisService: RedisService,
  ) { }

  public async root(): Promise<any> {
    return await this.redisService.getClient(environment.redis.name)
  }

  public async set(type: string, data: string) {
    const client = await this.root();
    await client.set(type, data);
  }

  public async get(type: string): Promise<string> {
    const client = await this.root();
    return await client.get(type);
  }
}

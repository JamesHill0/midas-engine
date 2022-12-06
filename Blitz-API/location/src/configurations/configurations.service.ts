import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import { environment } from 'src/config/development.env';

@Injectable()
export class ConfigurationsService {
    constructor(
        private readonly redisService: RedisService,
    ) { }

    async root(): Promise<any> {
        return await this.redisService.getClient(environment.redis.name)
    }

    async set(type: string, data: string) {
        const client = await this.root();
        await client.set(type, data);
    }

    async get(type: string): Promise<string> {
        const client = await this.root();
        return await client.get(type);
    }
}
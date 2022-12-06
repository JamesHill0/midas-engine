import { HttpModule, Module } from '@nestjs/common';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

@Module({
    imports: [HttpModule],
    exports: [],
    controllers: [WebhooksController],
    providers: [WebhooksService, ConfigurationsService]
})
export class WebhooksModule { }

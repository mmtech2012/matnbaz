import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { GithubModule } from '../github/github.module';
import { OctokitModule } from '../octokit/octokit.module';
import { GITHUB_QUEUE } from '../queue';
import { GithubLocationController } from './github-location.controller';
import { GithubLocationProcessor } from './github-location.processor';
import { GithubLocationScheduler } from './github-location.scheduler';
import { GithubLocationService } from './github-location.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: GITHUB_QUEUE }),
    OctokitModule,
    GithubModule,
  ],
  providers: [
    GithubLocationProcessor,
    GithubLocationScheduler,
    GithubLocationService,
  ],
  controllers: [GithubLocationController],
  exports: [],
})
export class GithubLocationModule {}
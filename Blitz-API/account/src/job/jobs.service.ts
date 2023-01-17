import { Injectable } from '@nestjs/common';
import { Job } from './entities/job.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobDto } from './dto/job.dto';

@Injectable()
export class JobsService {
  @InjectRepository(Job)
  private readonly jobRepository: Repository<Job>

  public async findAll(query: any): Promise<Job[]> {
    let selectQueryBuilder = this.jobRepository.createQueryBuilder('jobs');

    let limit = 500;
    if (query.limit) {
      if (isNaN(query.limit)) {
        limit = 500;
      }
      limit = Number(query.limit);
    }

    let queries = [];
    Object.entries(query).forEach(
      ([key, value]) => {
        if (key.substring(0, 2) == 'q_') {
          const typ = key.split('_');
          queries.push({ type: typ[1], value: value });
        }
      }
    );

    queries.map((q) => {
      selectQueryBuilder = selectQueryBuilder.where(`${q.type} = :value`, { value: q.value });
    })

    return await selectQueryBuilder.limit(limit).getMany();
  }

  public async findById(id: string): Promise<Job | null> {
    return await this.jobRepository.findOneOrFail(id);
  }

  public async findByApiKey(apiKey: string): Promise<Job | null> {
    return await this.jobRepository.findOneOrFail({
      where:
        { apiKey: apiKey }
    });
  }

  public async findByExternalApiKey(externalApiKey: string): Promise<Job | null> {
    return await this.jobRepository.findOneOrFail({
      where:
        { externalApiKey: externalApiKey }
    });
  }

  private async save(dto: JobDto): Promise<Job> {
    return await this.jobRepository.save(dto);
  }

  public async create(dto: JobDto): Promise<Job> {
    return await this.save(dto);
  }

  public async update(
    id: string,
    newValue: any,
  ): Promise<Job | null> {
    const data = await this.jobRepository.findOneOrFail(id);
    if (!data.id) {
      // tslint:disable-next-line:no-console
      console.error("Job doesn't exist");
    }
    await this.jobRepository.update(id, newValue);
    return await this.jobRepository.findOne(id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.jobRepository.delete(id);
  }
}

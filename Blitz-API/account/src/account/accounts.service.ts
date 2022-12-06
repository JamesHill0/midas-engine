import { Injectable } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountDto } from './dto/account.dto';
import { AccountType } from 'src/enums/account.type';
import * as uuid from "uuid";

@Injectable()
export class AccountsService {
  @InjectRepository(Account)
  private readonly accountRepository: Repository<Account>

  public async findAll(query: any): Promise<Account[]> {
    let selectQueryBuilder = this.accountRepository.createQueryBuilder('accounts');

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

  public async findById(id: string): Promise<Account | null> {
    return await this.accountRepository.findOneOrFail(id);
  }

  public async findByApiKey(apiKey: string): Promise<Account | null> {
    return await this.accountRepository.findOneOrFail({
      where:
        { apiKey: apiKey }
    });
  }

  public async findByExternalApiKey(externalApiKey: string): Promise<Account | null> {
    return await this.accountRepository.findOneOrFail({
      where:
        { externalApiKey: externalApiKey }
    });
  }

  private async save(dto: AccountDto): Promise<Account> {
    return await this.accountRepository.save(dto);
  }

  public async create(dto: AccountDto): Promise<Account> {
    dto.apiKey = uuid.v1();
    dto.externalApiKey = uuid.v1();
    const timestamp = Math.floor(Date.now() / 1000);
    if (dto.type == AccountType.INTERNAL) {
      dto.number = `I-${timestamp}`;
    } else {
      dto.number = `C-${timestamp}`;
    }
    return await this.save(dto);
  }

  public async update(
    id: string,
    newValue: any,
  ): Promise<Account | null> {
    const data = await this.accountRepository.findOneOrFail(id);
    if (!data.id) {
      // tslint:disable-next-line:no-console
      console.error("Account doesn't exist");
    }
    await this.accountRepository.update(id, newValue);
    return await this.accountRepository.findOne(id);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return await this.accountRepository.delete(id);
  }
}

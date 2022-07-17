import { Injectable } from '@nestjs/common';
import { Game, GameCollection, GameEntity } from './entities/game.entity';
import { getConnection, Repository } from 'typeorm';
import { GameDto } from './dto/game.dto';

import { CredentialType } from 'src/enums/credential.type';

import * as admin from 'firebase-admin';
import * as fireorm from 'fireorm';
import { createConnection } from 'net';
import { ConfigurationsService } from 'src/configurations/configurations.service';
import { GameScorecard, GameScorecardCollection } from './entities/game_scorecard.entity';
import { GameTeam, GameTeamCollection } from './entities/game_team.entity';

import { CoursesService } from 'src/course/courses.service';
import { GameScorecardDto } from './dto/game_scorecard.dto';

@Injectable()
export class GamesService {
    constructor(
        private readonly coursesService: CoursesService,
        private readonly configurationsService: ConfigurationsService
    ) { }

    private async connection(): Promise<GamesConfig> {
        let config = await this.configurationsService.get('client');
        let conn = JSON.parse(config);
        if (conn.type == CredentialType.FIRE) {
            return new GamesFireorm(conn, this.coursesService);
        } else {
            return new GamesTypeorm(conn);
        }
    }

    public async findAll(): Promise<Game[]> {
        const repository = await this.connection();
        return repository.findAll();
    }

    public async findById(id: string): Promise<Game | null> {
        const repository = await this.connection();
        return await repository.findById(id);
    }

    public async findByUserId(id: string): Promise<Game[]> {
        const repository = await this.connection();
        return await repository.findByUserId(id);
    }

    public async create(dto: GameDto): Promise<Game> {
        const repository = await this.connection();
        return await repository.create(dto);
    }

    public async update(
        id: string,
        newValue: GameDto,
    ): Promise<Game | null> {
        const repository = await this.connection();
        return await repository.update(id, newValue);
    }

    public async delete(id: string) {
        const repository = await this.connection();
        await repository.delete(id);
    }
}

interface GamesConfig {
    findAll(): Promise<Game[]>;
    findById(id: string): Promise<Game | null>;
    findByUserId(id: string): Promise<Game[]>;
    create(dto: GameDto): Promise<Game>;
    update(id: string, newValue: GameDto): Promise<Game | null>;
    delete(id: string);
}

class GamesTypeorm implements GamesConfig {
    constructor(
        private connection: any
    ) { }

    private async repository(): Promise<Repository<GameEntity>> {
        let connection = getConnection(this.connection.name);
        await connection.synchronize(true);
        return connection.getRepository(GameEntity);
    }

    public async findAll(): Promise<Game[]> {
        const repository = await this.repository();
        return await repository.find();
    }

    public async findById(id: string): Promise<Game | null> {
        const repository = await this.repository();
        return await repository.findOneOrFail(id);
    }

    public async findByUserId(id: string): Promise<Game[]> {
        const repository = await this.repository();
        return await repository.find({'userId': id});
    }

    public async create(dto: GameDto): Promise<Game> {
        const repository = await this.repository();
        return await repository.save(dto);
    }

    public async update(
        id: string,
        newValue: GameDto,
    ): Promise<Game | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Game doesn't exist");
        }
        const repository = await this.repository();
        await repository.update(id, newValue);
        return await this.findById(id);
    }

    public async delete(id: string) {
        const repository = await this.repository();
        await repository.delete(id);
    }
}

class GamesFireorm implements GamesConfig {
    constructor(
        private connection: any,
        private coursesService: CoursesService
    ) { }


    private async initialize() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(this.connection.key),
                databaseURL: `https://${this.connection.key.project_id}.firebaseio.com`
            });

            const firestore = admin.firestore();
            firestore.settings({
                timestampsInSnapshots: true
            });

            fireorm.initialize(firestore);
        }
    }

    private async repository(): Promise<fireorm.BaseFirestoreRepository<GameCollection> | null> {
        await this.initialize();
        return fireorm.getRepository(GameCollection);
    }

    private async findScorecardsByGameId(id: string): Promise<GameScorecard[]> {
        let scorecards = [];
        
        await this.initialize();
        let repository = fireorm.getRepository(GameScorecardCollection);
        let result = await repository.whereEqualTo('gameId', id).find();
        result.map((res) => {
            scorecards.push(new GameScorecard(res));
        });

        return scorecards;
    } 

    private async findTeamsByGameId(id: string): Promise<GameTeam[]> {
        let teams = [];

        await this.initialize();
        let repository = fireorm.getRepository(GameTeamCollection);
        let result = await repository.whereEqualTo('gameId', id).find();
        result.map((res) => {
            teams.push(new GameTeam(res));
        });

        return teams;
    }

    public async findAll(): Promise<Game[]> {
        let games = [];

        const repository = await this.repository();
        let result = await repository.find();
        await Promise.all(result.map(async (res) => {
            res.course = await this.coursesService.findById(res.courseId);
            res.scorecards = await this.findScorecardsByGameId(res.id);
            res.teams = await this.findTeamsByGameId(res.id);
            games.push(new Game(res));
        }));

        return games;
    }

    public async findById(id: string): Promise<Game | null> {
        const repository = await this.repository();
        let result = await repository.findById(id);

        result.course = await this.coursesService.findById(result.courseId);
        result.scorecards = await this.findScorecardsByGameId(result.id);
        result.teams = await this.findTeamsByGameId(result.id);

        return new Game(result);
    }

    public async findByUserId(id: string): Promise<Game[]> {
        let games = [];

        const repository = await this.repository();
        let result = await repository.whereEqualTo('userId', id).find();
        await Promise.all(result.map(async (res) => {
            res.course = await this.coursesService.findById(res.courseId);
            res.scorecards = await this.findScorecardsByGameId(res.id);
            res.teams = await this.findTeamsByGameId(res.id);
            games.push(new Game(res));
        }));

        return games;
    }

    private async createTeam(dto: GameTeam): Promise<GameTeam> {
        await this.initialize();
        let repository = fireorm.getRepository(GameTeamCollection);
        let result = await repository.create(dto);
        return new GameTeam(result);
    }

    private async createScorecard(dto: GameScorecardDto): Promise<GameScorecard> {
        await this.initialize();
        let repository = fireorm.getRepository(GameScorecardCollection);
        let result = await repository.create(dto);
        return new GameScorecard(result);
    }

    private async updateScorecard(id: string, newValue: GameScorecardDto): Promise<GameScorecard> {
        await this.initialize();
        let repository = fireorm.getRepository(GameScorecardCollection);

        let data = await repository.findById(id);
        let updatedValue = new GameScorecardCollection();
        Object.assign(data, newValue);
        Object.assign(updatedValue, data);

        await repository.update(updatedValue);
        let result = await repository.findById(id);
        return new GameScorecard(result);
    }

    public async create(dto: GameDto): Promise<Game> {
        const repository = await this.repository();

        let teams = dto.teams;
        let scorecards = dto.scorecards;

        dto.teams = null;
        dto.scorecards = null;
        let result = await repository.create(dto);

        // Create game teams
        if (teams.length > 0) {
            await Promise.all(teams.map(async (res) => {
                res.gameId = result.id;
                await this.createTeam(res);
            }));
        }

        // Create game scorecards
        if (scorecards.length > 0) {
            await Promise.all(scorecards.map(async (res) => {
                res.gameId = result.id;
                await this.createScorecard(res);
            })); 
        }

        result = await this.findById(result.id);
        return new Game(result);
    }

    public async update(
        id: string,
        newValue: GameDto,
    ): Promise<Game | null> {
        const data = await this.findById(id);
        if (!data.id) {
            // tslint:disable-next-line:no-console
            console.error("Game doesn't exist");
        }

        let updatedValue = new GameCollection();
        Object.assign(data, newValue);
        Object.assign(updatedValue, data);
        
        if (newValue.scorecards && newValue.scorecards.length > 0) {
            await Promise.all(newValue.scorecards.map(async (scorecard) => {
                if (scorecard.id != null) {
                    await this.updateScorecard(scorecard.id, scorecard);
                } else {
                    await this.createScorecard(scorecard);
                }
            }));
        }
        updatedValue.teams = null;
        updatedValue.scorecards = null;
        updatedValue.course = null;

        const repository = await this.repository();
        await repository.update(updatedValue);
        return await this.findById(id);
    }

    public async delete(id: string) {
        const repository = await this.repository();
        await repository.delete(id);
    }
}
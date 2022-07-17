import {
    Entity,
    PrimaryGeneratedColumn,
    Column
} from 'typeorm';

@Entity()
export class Buyer {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    latitude: number;

    @Column()
    longtitude: number;
}
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Server {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    serverId: string;
}
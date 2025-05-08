import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Server {
    @PrimaryColumn()
    serverId: string;

    @Column()
    name: string;
}
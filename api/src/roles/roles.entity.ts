import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    roleId: string;

    @OneToMany(() => Role, (role) => role.children, { nullable: true , onDelete: 'SET NULL'})
    parent: Role;

    @ManyToOne(() => Role, (role) => role.parent)
    children: Role[];
}
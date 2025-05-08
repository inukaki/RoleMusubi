import { Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Role } from "./roles.entity";

@Entity()
export class RoleRelation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Role, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'parent_role_id', referencedColumnName: 'roleId' })
    parent: Role;

    @ManyToOne(() => Role, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'child_role_id', referencedColumnName: 'roleId' })
    child: Role;
} 
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { RoleRelation } from "./role-relation.entity";

@Entity()
export class Role {
    @PrimaryColumn()
    roleId: string;

    @Column()
    name: string;

    @OneToMany(() => RoleRelation, relation => relation.parent)
    parentRelations: RoleRelation[];

    @OneToMany(() => RoleRelation, relation => relation.child)
    childRelations: RoleRelation[];
}
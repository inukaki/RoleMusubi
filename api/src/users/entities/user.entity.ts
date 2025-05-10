import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { UserRole } from './user-role.entity';

@Entity()
export class User {
  @PrimaryColumn()
  discordId: string;

  @Column({ nullable: true })
  username: string;

  @OneToMany(() => UserRole, userRole => userRole.user)
  userRoles: UserRole[];
} 
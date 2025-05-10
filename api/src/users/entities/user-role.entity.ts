import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../../roles/roles.entity';

@Entity()
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  discordId: string;

  @Column()
  roleId: string;

  @Column({ type: 'datetime' })
  assignedAt: Date;

  @ManyToOne(() => User, user => user.userRoles)
  @JoinColumn({ name: 'discordId' })
  user: User;

  @ManyToOne(() => Role, role => role.userRoles)
  @JoinColumn({ name: 'roleId' })
  role: Role;
} 
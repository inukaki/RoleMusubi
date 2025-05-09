import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Role } from '../../roles/roles.entity';

@Entity()
export class UserRole {
  @PrimaryColumn()
  discordId: string;

  @PrimaryColumn()
  roleId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  @ManyToOne(() => User, user => user.userRoles)
  @JoinColumn({ name: 'discordId' })
  user: User;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId' })
  role: Role;
} 
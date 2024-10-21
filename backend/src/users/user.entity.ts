import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Company } from '../companies/company.entity';
import { Role } from '../enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: string;

  @OneToMany(() => Company, (company) => company.owner)
  companies: Company[];
}

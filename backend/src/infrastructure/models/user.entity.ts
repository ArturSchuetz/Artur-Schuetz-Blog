import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { Media } from './media.entity';
import { BlogArticle } from './blog-article.entity';
import { TutorialArticle } from './tutorial-article.entity';

export enum Role {
  ADMIN = 'Admin',
  USER = 'User',
}

@Entity()
@Index('email_index', ['email'])
@Index('username_index', ['username'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  salt: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @Column({ nullable: true })
  resetPasswordExpires: Date;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ nullable: false, default: false })
  isVerified: boolean;

  @ManyToOne(() => Media)
  @JoinColumn({ name: 'avatarImageId' })
  avatarImage: Media;

  @Column({ nullable: true })
  avatarImageId: number;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: false, default: true })
  isActive: boolean;

  @Column({ nullable: true })
  lastLogin: Date;

  @Column('json', { nullable: true })
  metadata: string;

  @OneToMany(() => BlogArticle, (article) => article.author)
  articles: BlogArticle[];

  @OneToMany(() => TutorialArticle, (tutorial) => tutorial.author)
  tutorials: TutorialArticle[];

  @OneToMany(() => Media, (media) => media.user)
  medias: Media[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

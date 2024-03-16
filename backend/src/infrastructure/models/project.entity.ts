import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Media } from './media.entity';

@Entity()
export class Project extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  category: string;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => Media)
  @JoinColumn({ name: 'imageMediaId' })
  image: Media;

  @Column({ nullable: true })
  imageMediaId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  background: string;

  @Column({ type: 'varchar', length: 255 })
  link: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Media, (media) => media.project)
  medias: Media[];
}

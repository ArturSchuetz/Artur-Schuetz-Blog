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
  Index,
} from 'typeorm';
import { TutorialTopic } from './tutorial-topic.entity';
import { Media } from './media.entity';

@Entity()
@Index('idx_slug', ['slug'])
export class TutorialCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 0 })
  position: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @ManyToOne(() => Media)
  @JoinColumn({ name: 'imageId' })
  image: Media;

  @Column({ nullable: true })
  imageId: number;

  @OneToMany(() => TutorialTopic, (topic) => topic.category)
  topics: TutorialTopic[];

  @OneToMany(() => Media, (media) => media.tutorialCategory)
  medias: Media[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

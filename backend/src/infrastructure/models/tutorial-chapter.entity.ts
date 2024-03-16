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
import { TutorialArticle } from './tutorial-article.entity';
import { Media } from './media.entity';

@Entity()
@Index('idx_slug', ['slug'])
export class TutorialChapter extends BaseEntity {
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

  @ManyToOne(() => TutorialTopic)
  @JoinColumn({ name: 'topicId' })
  topic: TutorialTopic;

  @Column({ nullable: true })
  topicId: number;

  @OneToMany(() => TutorialArticle, (article) => article.chapter)
  articles: TutorialArticle[];

  @OneToMany(() => Media, (media) => media.tutorialChapter)
  medias: Media[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

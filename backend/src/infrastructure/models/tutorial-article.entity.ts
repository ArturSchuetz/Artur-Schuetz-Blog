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
import { TutorialChapter } from './tutorial-chapter.entity';
import { Media } from './media.entity';
import { User } from './user.entity';
import { PageView } from './page-view.entity';

@Entity()
@Index('idx_slug', ['slug'])
export class TutorialArticle extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 0 })
  position: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  shortTitle: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  previewHostedVideoUrl: string;
  
  @ManyToOne(() => Media)
  @JoinColumn({ name: 'previewMediaId' })
  previewMedia: Media;

  @Column({ nullable: true })
  previewMediaId: number;

  @Column({ type: 'varchar', length: 512, nullable: true })
  previewText?: string;

  @Column({ type: 'varchar', length: 1024, nullable: true })
  tags?: string[];

  @Column({ type: 'text', nullable: true })
  text: string;

  @ManyToOne(() => TutorialChapter)
  @JoinColumn({ name: 'chapterId' })
  chapter: TutorialChapter;

  @Column({ nullable: true })
  chapterId: number;

  @Column({ type: 'boolean', default: false })
  useMathJax: boolean;

  @Column({ type: 'boolean', default: false })
  isPublished: boolean;

  @Column({ type: 'timestamp', nullable: true })
  releasedAt: Date | null;

  @ManyToOne(() => User, (user) => user.tutorials)
  @JoinColumn({ name: 'authorId' })
  author: User;

  @Column({ nullable: true })
  authorId: number;

  @OneToMany(() => Media, (media) => media.tutorialArticle)
  medias: Media[];
  
  @OneToMany(() => PageView, (pageView) => pageView.tutorial)
  views: PageView[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

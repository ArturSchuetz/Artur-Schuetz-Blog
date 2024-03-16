import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { BlogArticle } from './blog-article.entity';
import { TutorialArticle } from './tutorial-article.entity';

@Entity()
export class PageView extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64 })
  ipHash: string;

  @ManyToOne(() => BlogArticle, (article) => article.views, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'articleId' })
  article: BlogArticle;

  @Column({ nullable: true })
  articleId: number;

  @ManyToOne(() => TutorialArticle, (tutorial) => tutorial.views, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'tutorialId' })
  tutorial: TutorialArticle;

  @Column({ nullable: true })
  tutorialId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

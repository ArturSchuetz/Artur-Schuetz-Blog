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
import { TutorialCategory } from './tutorial-category.entity';
import { TutorialChapter } from './tutorial-chapter.entity';
import { Media } from './media.entity';

@Entity()
@Index('idx_slug', ['slug'])
export class TutorialTopic extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, default: 0 })
  position: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  color: string;

  @ManyToOne(() => Media)
  @JoinColumn({ name: 'imageId' })
  image: Media;

  @Column({ nullable: true })
  imageId: number;

  @ManyToOne(() => TutorialCategory)
  @JoinColumn({ name: 'categoryId' })
  category: TutorialCategory;

  @Column({ nullable: true })
  categoryId: number;

  @OneToMany(() => TutorialChapter, (chapter) => chapter.topic)
  chapters: TutorialChapter[];

  @OneToMany(() => Media, (media) => media.tutorialTopic)
  medias: Media[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

enum Folder {
  INBOX = 'Inbox',
  SENT = 'Sent',
  DRAFT = 'Draft',
  ARCHIVE = 'Archive',
  SPAM = 'Spam',
  THRASH = 'Trash',
}

@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'enum', enum: Folder, default: Folder.INBOX })
  folder: Folder;

  @Column({ type: 'boolean', default: false })
  starred: boolean;

  @Column({ type: 'boolean', default: false })
  read: boolean;

  @Column({ type: 'boolean', default: false })
  spam: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

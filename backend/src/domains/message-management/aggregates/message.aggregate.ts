import { AggregateRoot } from '@nestjs/cqrs';

export class MessageAggregate extends AggregateRoot {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly message: string,
    public readonly read: boolean,
  ) {
    super();
  }

  getId(): number {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getEmail(): string {
    return this.email;
  }

  getMessage(): string {
    return this.message;
  }

  getRead(): boolean {
    return this.read;
  }

  static async create(
    id: number,
    name: string,
    email: string,
    message: string,
    read: boolean,
  ): Promise<MessageAggregate> {
    const messageAggregate = new MessageAggregate(
      id,
      name,
      email,
      message,
      read,
    );
    return messageAggregate;
  }
}

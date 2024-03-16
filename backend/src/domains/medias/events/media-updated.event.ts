export class MediaUpdatedEvent {
  constructor(private readonly mediaId: number) {}

  getMediaId(): number {
    return this.mediaId;
  }
}

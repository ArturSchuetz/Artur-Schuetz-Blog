export class ProjectUpdatedEvent {
  constructor(private readonly projectId: number) {}

  getProjectId(): number {
    return this.projectId;
  }
}

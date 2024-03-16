export class ProjectCreatedEvent {
  constructor(private readonly projectId: number) {}

  getProjectId(): number {
    return this.projectId;
  }
}

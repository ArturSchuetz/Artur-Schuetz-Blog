export class ProjectDeletedEvent {
  constructor(private readonly projectId: number) {}

  getProjectId(): number {
    return this.projectId;
  }
}

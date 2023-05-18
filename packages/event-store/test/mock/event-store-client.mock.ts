export class EventStoreClientMock {
  getProjectionStatus = jest.fn().mockRejectedValue(undefined);
  createProjection = jest.fn().mockResolvedValue(undefined);
  updateProjection = jest.fn().mockResolvedValue(undefined);
}

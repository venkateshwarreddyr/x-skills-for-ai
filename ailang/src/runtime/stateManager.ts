export class StateManager {
  private state: any = {};

  get(): any {
    return this.state;
  }

  update(updates: any): void {
    Object.assign(this.state, updates);
  }
}
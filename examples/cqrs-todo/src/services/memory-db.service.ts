import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryDbService {
  public db = {};

  set(id: string, value: any) {
    this.db[id] = value;
  }

  get(id: string): any {
    return this.db[id];
  }

  delete(id: string) {
    delete this.db[id];
  }
}

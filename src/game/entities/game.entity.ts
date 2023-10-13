import {v4} from "uuid";

export class Game {
  public readonly id: string;
  
  constructor() {
    this.id = v4();
  }
}

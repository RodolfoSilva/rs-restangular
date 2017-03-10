import { PathInterface } from './path.interface';
export class RestangularAllPath implements PathInterface {
  constructor(
    public endpoint: string
  ) { }

  public path(): Array<string> {
    return [this.endpoint];
  }
}

import { PathInterface } from './path.interface';
export class RestangularOnePath implements PathInterface {
  public primaryKey: string;

  constructor(
    public endpoint: string,
    primaryKey: string | number
  ) {
    this.primaryKey = primaryKey.toString();
  }

  public path(): Array<string> {
    return [this.endpoint, this.primaryKey];
  }
}

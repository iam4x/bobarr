import { EntityRepository, Repository } from 'typeorm';
import { Parameter } from '../parameter.entity';

@EntityRepository(Parameter)
export class ParameterDAO extends Repository<Parameter> {
  public async findOrCreate({
    key,
    value,
  }: {
    key: Parameter['key'];
    value: Parameter['value'];
  }) {
    const param = await this.findOne({ key });
    return param || this.save({ key, value });
  }
}

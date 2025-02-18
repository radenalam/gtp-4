import { BaseDto } from './base.dto';
import { PaginationDto } from './pagination.dto';

export class ResponseDto<T = any> extends BaseDto {
  data: T;
  pagination: PaginationDto;
  constructor(data: Partial<ResponseDto<T>>) {
    super(data);
    Object.assign(this, data);
  }
}

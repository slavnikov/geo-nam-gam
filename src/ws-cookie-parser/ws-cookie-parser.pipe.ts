import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class WsCookieParserPipe implements PipeTransform<String,String> {
  transform(value: string, metadata: ArgumentMetadata) {
    console.log(metadata.type);
    console.log(typeof value);
    return value;
  }
}

import {UsePipes} from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import {WsCookieParserPipe} from 'src/ws-cookie-parser/ws-cookie-parser.pipe';

@UsePipes(WsCookieParserPipe)
@WebSocketGateway()
export class PlayGateway {
  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}

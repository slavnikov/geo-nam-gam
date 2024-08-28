import { User } from './user.entity';
import {WebSocket} from "ws";

describe('User', () => {
  let user: User;
  const socket_mock = {} as any as WebSocket;
  const socket_send_mock = jest.fn();

  socket_mock.send = socket_send_mock;

  beforeEach(() => {
    user = new User('user1');
  });

  it('should be defined', () => {
    expect(user).toBeDefined();
  });

  it('should allow a socket to be set', () => {
    const socket = {};

    user.setSocket(socket as any);
    expect(user.getSocket()).toBe(socket);
  });

  it('should invoke the send method on the socket', () => {
    user.setSocket(socket_mock);
    user.tell({resType: 1});
    expect(socket_send_mock)
      .toHaveBeenCalledTimes(1);
    expect(socket_send_mock)
      .toHaveBeenCalledWith('{"resType":1}');
  });
});

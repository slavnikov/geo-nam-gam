export enum PlayGateType {
  CREATE_GAME = 'game/create',
  JOIN_GAME = 'game/join',
}

export enum GateResType {
  GAME_CREATE,
  GAME_JOIN,
}

export interface CreateGameRes {
  resType: GateResType.GAME_CREATE;
  resData: string;
}

export interface JoinGameRes {
  resType: GateResType.GAME_JOIN;
}

export type PlayGateRes = CreateGameRes | JoinGameRes;

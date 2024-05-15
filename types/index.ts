export type Character = {
  id: string;
  name: string;
  isPlayer: boolean;
  isNPC: boolean;
  ctx: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
  game: {
    speed: number;
    bombs: number;
    range: number;
  };
};

// 游戏类型定义

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  vx: number;
  vy: number;
}

export interface Fish {
  id: string;
  x: number;
  y: number;
  size: number; // 鱼的大小（半径）
  speed: number;
  angle: number; // 游动角度
  color: string;
  type: 'player' | 'enemy';
  score: number; // 吃掉这条鱼获得的分数
}

export interface PlayerFish extends Fish {
  type: 'player';
  targetX: number;
  targetY: number;
}

export interface EnemyFish extends Fish {
  type: 'enemy';
  direction: number; // 1: 向右, -1: 向左
  changeDirectionTimer: number;
}

export interface Bubble {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

export interface Seaweed {
  x: number;
  height: number;
  swayOffset: number;
  color: string;
}

export type GameState = 'menu' | 'playing' | 'paused' | 'gameOver';

export interface GameStats {
  score: number;
  highScore: number;
  level: number;
  fishEaten: number;
}

export const FISH_COLORS = [
  '#FF6B6B', // 珊瑚红
  '#4ECDC4', // 青绿色
  '#45B7D1', // 天蓝色
  '#96CEB4', // 薄荷绿
  '#FFEAA7', // 淡黄色
  '#DDA0DD', // 梅花色
  '#98D8C8', // 海泡绿
  '#F7DC6F', // 金黄色
  '#BB8FCE', // 薰衣草紫
  '#85C1E9', // 淡蓝色
];

export const PLAYER_COLORS = {
  body: '#FF9500',
  fin: '#FFB84D',
  eye: '#FFFFFF',
  pupil: '#000000',
};

// 游戏配置
export const GAME_CONFIG = {
  canvasWidth: 1200,
  canvasHeight: 800,
  playerInitialSize: 20,
  playerMaxSize: 150,
  playerSpeed: 4,
  enemySpawnInterval: 1500, // 毫秒
  bubbleSpawnInterval: 800,
  minEnemySize: 10,
  maxEnemySize: 120,
  growthRate: 0.3, // 吃掉鱼后增长的比例
  scoreMultiplier: 10,
};

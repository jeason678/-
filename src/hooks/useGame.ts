import { useState, useRef, useCallback, useEffect } from 'react';
import type {
  Fish,
  PlayerFish,
  EnemyFish,
  Bubble,
  GameState,
  GameStats,
  Position,
} from '@/types/game';
import {
  FISH_COLORS,
  PLAYER_COLORS,
  GAME_CONFIG,
} from '@/types/game';

// 生成唯一ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// 生成随机颜色
const getRandomColor = () => FISH_COLORS[Math.floor(Math.random() * FISH_COLORS.length)];

// 生成随机大小
const getRandomSize = (min: number, max: number) => Math.random() * (max - min) + min;

// 创建玩家鱼
const createPlayerFish = (x: number, y: number): PlayerFish => ({
  id: 'player',
  x,
  y,
  size: GAME_CONFIG.playerInitialSize,
  speed: GAME_CONFIG.playerSpeed,
  angle: 0,
  color: PLAYER_COLORS.body,
  type: 'player',
  score: 0,
  targetX: x,
  targetY: y,
});

// 创建敌人鱼
const createEnemyFish = (canvasWidth: number, canvasHeight: number, playerSize: number): EnemyFish => {
  const size = getRandomSize(GAME_CONFIG.minEnemySize, Math.min(playerSize * 1.5, GAME_CONFIG.maxEnemySize));
  const direction = Math.random() > 0.5 ? 1 : -1;
  const y = Math.random() * (canvasHeight - 100) + 50;
  const x = direction === 1 ? -size - 50 : canvasWidth + size + 50;
  
  return {
    id: generateId(),
    x,
    y,
    size,
    speed: getRandomSize(1, 3) * (120 / (size + 20)), // 小鱼游得更快
    angle: direction === 1 ? 0 : Math.PI,
    color: getRandomColor(),
    type: 'enemy',
    score: Math.floor(size * GAME_CONFIG.scoreMultiplier),
    direction,
    changeDirectionTimer: 0,
  };
};

// 创建气泡
const createBubble = (canvasWidth: number, canvasHeight: number): Bubble => ({
  id: generateId(),
  x: Math.random() * canvasWidth,
  y: canvasHeight + 20,
  size: getRandomSize(3, 12),
  speed: getRandomSize(0.5, 2),
  opacity: getRandomSize(0.3, 0.7),
});

// 碰撞检测
const checkCollision = (fish1: Fish, fish2: Fish): boolean => {
  const dx = fish1.x - fish2.x;
  const dy = fish1.y - fish2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < (fish1.size + fish2.size) * 0.7; // 0.7 让碰撞更宽松
};

export const useGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const lastEnemySpawn = useRef<number>(0);
  const lastBubbleSpawn = useRef<number>(0);
  
  const [gameState, setGameState] = useState<GameState>('menu');
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    highScore: 0,
    level: 1,
    fishEaten: 0,
  });
  
  const [player, setPlayer] = useState<PlayerFish>(() => 
    createPlayerFish(GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight / 2)
  );
  const [enemies, setEnemies] = useState<EnemyFish[]>([]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });

  // 开始游戏
  const startGame = useCallback(() => {
    setGameState('playing');
    setPlayer(createPlayerFish(GAME_CONFIG.canvasWidth / 2, GAME_CONFIG.canvasHeight / 2));
    setEnemies([]);
    setBubbles([]);
    setStats(prev => ({ ...prev, score: 0, level: 1, fishEaten: 0 }));
    lastEnemySpawn.current = 0;
    lastBubbleSpawn.current = 0;
  }, []);

  // 暂停/继续游戏
  const togglePause = useCallback(() => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  }, []);

  // 游戏结束
  const gameOver = useCallback(() => {
    setGameState('gameOver');
    setStats(prev => ({
      ...prev,
      highScore: Math.max(prev.score, prev.highScore),
    }));
  }, []);

  // 更新玩家位置（跟随鼠标）
  const updatePlayer = useCallback((player: PlayerFish, mouseX: number, mouseY: number): PlayerFish => {
    const dx = mouseX - player.x;
    const dy = mouseY - player.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      const angle = Math.atan2(dy, dx);
      const speed = Math.min(player.speed, distance * 0.1);
      
      return {
        ...player,
        x: player.x + Math.cos(angle) * speed,
        y: player.y + Math.sin(angle) * speed,
        angle,
        targetX: mouseX,
        targetY: mouseY,
      };
    }
    
    return player;
  }, []);

  // 更新敌人鱼
  const updateEnemies = useCallback((enemies: EnemyFish[], player: PlayerFish, deltaTime: number): EnemyFish[] => {
    return enemies
      .map(enemy => {
        // 随机改变方向
        enemy.changeDirectionTimer += deltaTime;
        if (enemy.changeDirectionTimer > 3000 && Math.random() < 0.01) {
          enemy.direction *= -1;
          enemy.changeDirectionTimer = 0;
        }
        
        // 小鱼会稍微避开玩家
        let avoidX = 0;
        let avoidY = 0;
        if (enemy.size < player.size) {
          const dx = enemy.x - player.x;
          const dy = enemy.y - player.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150 && dist > 0) {
            avoidX = (dx / dist) * 2;
            avoidY = (dy / dist) * 2;
          }
        }
        
        return {
          ...enemy,
          x: enemy.x + enemy.direction * enemy.speed + avoidX,
          y: enemy.y + Math.sin(enemy.x * 0.01) * 0.5 + avoidY,
          angle: enemy.direction === 1 ? 0 : Math.PI,
        };
      })
      .filter(enemy => enemy.x > -200 && enemy.x < GAME_CONFIG.canvasWidth + 200);
  }, []);

  // 更新气泡
  const updateBubbles = useCallback((bubbles: Bubble[]): Bubble[] => {
    return bubbles
      .map(bubble => ({
        ...bubble,
        y: bubble.y - bubble.speed,
        x: bubble.x + Math.sin(bubble.y * 0.02) * 0.5,
      }))
      .filter(bubble => bubble.y > -50);
  }, []);

  // 游戏主循环
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    let lastTime = performance.now();
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      // 更新玩家
      setPlayer(prev => updatePlayer(prev, mousePos.x, mousePos.y));
      
      // 生成敌人鱼
      if (currentTime - lastEnemySpawn.current > GAME_CONFIG.enemySpawnInterval) {
        setEnemies(prev => [...prev, createEnemyFish(GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight, player.size)]);
        lastEnemySpawn.current = currentTime;
      }
      
      // 生成气泡
      if (currentTime - lastBubbleSpawn.current > GAME_CONFIG.bubbleSpawnInterval) {
        setBubbles(prev => [...prev, createBubble(GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight)]);
        lastBubbleSpawn.current = currentTime;
      }
      
      // 更新敌人
      setEnemies(prev => updateEnemies(prev, player, deltaTime));
      
      // 更新气泡
      setBubbles(prev => updateBubbles(prev));
      
      // 检测碰撞
      setEnemies(prevEnemies => {
        const remainingEnemies: EnemyFish[] = [];
        let eatenCount = 0;
        let scoreGain = 0;
        let sizeGain = 0;
        
        for (const enemy of prevEnemies) {
          if (checkCollision(player, enemy)) {
            if (player.size >= enemy.size * 0.9) {
              // 吃掉敌人
              eatenCount++;
              scoreGain += enemy.score;
              sizeGain += enemy.size * GAME_CONFIG.growthRate;
            } else {
              // 被吃掉
              gameOver();
              remainingEnemies.push(enemy);
            }
          } else {
            remainingEnemies.push(enemy);
          }
        }
        
        if (eatenCount > 0) {
          setStats(prev => ({
            ...prev,
            score: prev.score + scoreGain,
            fishEaten: prev.fishEaten + eatenCount,
            level: Math.floor((prev.fishEaten + eatenCount) / 10) + 1,
          }));
          
          setPlayer(prev => ({
            ...prev,
            size: Math.min(prev.size + sizeGain, GAME_CONFIG.playerMaxSize),
          }));
        }
        
        return remainingEnemies;
      });
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, mousePos, player.size, updatePlayer, updateEnemies, updateBubbles, gameOver]);

  // 处理鼠标移动
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    setMousePos({
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    });
  }, []);

  // 处理触摸移动
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touch = e.touches[0];
    
    setMousePos({
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY,
    });
  }, []);

  return {
    canvasRef,
    gameState,
    stats,
    player,
    enemies,
    bubbles,
    startGame,
    togglePause,
    handleMouseMove,
    handleTouchMove,
  };
};

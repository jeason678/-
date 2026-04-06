import React, { useEffect, useRef } from 'react';
import type { PlayerFish, EnemyFish, Bubble } from '@/types/game';
import { GAME_CONFIG } from '@/types/game';

interface GameCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  player: PlayerFish;
  enemies: EnemyFish[];
  bubbles: Bubble[];
  onMouseMove: (e: React.MouseEvent<HTMLCanvasElement>) => void;
  onTouchMove: (e: React.TouchEvent<HTMLCanvasElement>) => void;
}

// 绘制鱼的函数
const drawFish = (
  ctx: CanvasRenderingContext2D,
  fish: PlayerFish | EnemyFish,
  isPlayer: boolean
) => {
  ctx.save();
  ctx.translate(fish.x, fish.y);
  
  // 根据游动方向翻转
  const facingRight = Math.abs(fish.angle) < Math.PI / 2;
  if (!facingRight) {
    ctx.scale(1, -1);
    ctx.rotate(Math.PI - fish.angle);
  } else {
    ctx.rotate(fish.angle);
  }
  
  const size = fish.size;
  
  if (isPlayer) {
    // 绘制玩家鱼（更精美的设计）
    
    // 鱼身渐变
    const bodyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
    bodyGradient.addColorStop(0, '#FFB84D');
    bodyGradient.addColorStop(0.6, '#FF9500');
    bodyGradient.addColorStop(1, '#E68600');
    
    // 鱼身
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 鱼鳞纹理
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    for (let i = -2; i <= 2; i++) {
      ctx.beginPath();
      ctx.arc(i * size * 0.25, 0, size * 0.15, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    // 尾巴
    const tailWag = Math.sin(Date.now() * 0.015) * 0.2;
    ctx.fillStyle = '#FF9500';
    ctx.beginPath();
    ctx.moveTo(-size * 0.8, 0);
    ctx.lineTo(-size * 1.4, -size * 0.5 + tailWag * size);
    ctx.lineTo(-size * 1.4, size * 0.5 + tailWag * size);
    ctx.closePath();
    ctx.fill();
    
    // 背鳍
    ctx.beginPath();
    ctx.moveTo(-size * 0.2, -size * 0.5);
    ctx.lineTo(size * 0.3, -size * 0.9);
    ctx.lineTo(size * 0.5, -size * 0.5);
    ctx.closePath();
    ctx.fill();
    
    // 腹鳍
    ctx.beginPath();
    ctx.moveTo(size * 0.1, size * 0.5);
    ctx.lineTo(size * 0.3, size * 0.8);
    ctx.lineTo(size * 0.5, size * 0.5);
    ctx.closePath();
    ctx.fill();
    
    // 眼睛
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(size * 0.5, -size * 0.2, size * 0.22, 0, Math.PI * 2);
    ctx.fill();
    
    // 瞳孔
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(size * 0.55, -size * 0.2, size * 0.1, 0, Math.PI * 2);
    ctx.fill();
    
    // 眼睛高光
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(size * 0.58, -size * 0.25, size * 0.04, 0, Math.PI * 2);
    ctx.fill();
    
    // 嘴巴
    ctx.strokeStyle = '#CC7700';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(size * 0.85, size * 0.05, size * 0.15, 0.2, Math.PI - 0.2);
    ctx.stroke();
    
    // 鱼鳃
    ctx.strokeStyle = 'rgba(204, 119, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(size * 0.2, 0, size * 0.3, -Math.PI * 0.3, Math.PI * 0.3);
    ctx.stroke();
    
  } else {
    // 绘制敌人鱼（简化版）
    
    // 鱼身
    ctx.fillStyle = fish.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, size, size * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // 鱼身边框
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // 尾巴
    const tailWag = Math.sin(Date.now() * 0.02 + fish.id.charCodeAt(0)) * 0.15;
    ctx.beginPath();
    ctx.moveTo(-size * 0.7, 0);
    ctx.lineTo(-size * 1.2, -size * 0.4 + tailWag * size);
    ctx.lineTo(-size * 1.2, size * 0.4 + tailWag * size);
    ctx.closePath();
    ctx.fill();
    
    // 眼睛
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(size * 0.4, -size * 0.15, size * 0.2, 0, Math.PI * 2);
    ctx.fill();
    
    // 瞳孔
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(size * 0.45, -size * 0.15, size * 0.08, 0, Math.PI * 2);
    ctx.fill();
    
    // 大小指示（小鱼显示危险标记）
    if (size > (fish as EnemyFish).size * 0.9) {
      // 可以吃
      ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(0, 0, size * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  ctx.restore();
};

// 绘制气泡
const drawBubble = (ctx: CanvasRenderingContext2D, bubble: Bubble) => {
  ctx.save();
  ctx.globalAlpha = bubble.opacity;
  
  // 气泡主体
  const gradient = ctx.createRadialGradient(
    bubble.x - bubble.size * 0.3,
    bubble.y - bubble.size * 0.3,
    0,
    bubble.x,
    bubble.y,
    bubble.size
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
  ctx.fill();
  
  // 气泡边框
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // 高光
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(
    bubble.x - bubble.size * 0.3,
    bubble.y - bubble.size * 0.3,
    bubble.size * 0.2,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  ctx.restore();
};

// 绘制海底背景
const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  // 深海渐变背景
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, '#006994');
  gradient.addColorStop(0.3, '#005a7f');
  gradient.addColorStop(0.6, '#004a6a');
  gradient.addColorStop(1, '#003d54');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // 海底沙地
  const sandGradient = ctx.createLinearGradient(0, height - 80, 0, height);
  sandGradient.addColorStop(0, 'rgba(194, 178, 128, 0.3)');
  sandGradient.addColorStop(1, 'rgba(194, 178, 128, 0.6)');
  
  ctx.fillStyle = sandGradient;
  ctx.beginPath();
  ctx.moveTo(0, height - 60);
  for (let x = 0; x <= width; x += 50) {
    ctx.lineTo(x, height - 60 + Math.sin(x * 0.02) * 15);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  
  // 光线效果
  ctx.save();
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 5; i++) {
    const x = (width / 6) * (i + 1) + Math.sin(Date.now() * 0.001 + i) * 30;
    const lightGradient = ctx.createLinearGradient(x, 0, x - 100, height);
    lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    lightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    ctx.fillStyle = lightGradient;
    ctx.beginPath();
    ctx.moveTo(x - 30, 0);
    ctx.lineTo(x + 30, 0);
    ctx.lineTo(x - 70, height);
    ctx.lineTo(x - 130, height);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
};

// 绘制海草
const drawSeaweed = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const seaweeds = [
    { x: width * 0.1, height: 120, color: '#2E8B57', offset: 0 },
    { x: width * 0.15, height: 80, color: '#3CB371', offset: 1 },
    { x: width * 0.85, height: 100, color: '#2E8B57', offset: 2 },
    { x: width * 0.9, height: 140, color: '#3CB371', offset: 3 },
    { x: width * 0.05, height: 60, color: '#228B22', offset: 4 },
    { x: width * 0.95, height: 90, color: '#228B22', offset: 5 },
  ];
  
  seaweeds.forEach(weed => {
    const sway = Math.sin(Date.now() * 0.002 + weed.offset) * 15;
    
    ctx.fillStyle = weed.color;
    ctx.beginPath();
    ctx.moveTo(weed.x - 8, height);
    
    // 使用贝塞尔曲线绘制弯曲的海草
    ctx.bezierCurveTo(
      weed.x - 8, height - weed.height * 0.3,
      weed.x + sway * 0.5, height - weed.height * 0.6,
      weed.x + sway, height - weed.height
    );
    ctx.bezierCurveTo(
      weed.x + sway + 8, height - weed.height * 0.6,
      weed.x + 8, height - weed.height * 0.3,
      weed.x + 8, height
    );
    
    ctx.closePath();
    ctx.fill();
    
    // 海草纹理
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(weed.x, height);
    ctx.quadraticCurveTo(
      weed.x + sway * 0.3, height - weed.height * 0.5,
      weed.x + sway, height - weed.height
    );
    ctx.stroke();
  });
};

export const GameCanvas: React.FC<GameCanvasProps> = ({
  canvasRef,
  player,
  enemies,
  bubbles,
  onMouseMove,
  onTouchMove,
}) => {
  const renderRef = useRef<number | undefined>(undefined);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const render = () => {
      // 清空画布
      ctx.clearRect(0, 0, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);
      
      // 绘制背景
      drawBackground(ctx, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);
      
      // 绘制海草（在鱼后面）
      drawSeaweed(ctx, GAME_CONFIG.canvasWidth, GAME_CONFIG.canvasHeight);
      
      // 绘制气泡
      bubbles.forEach(bubble => drawBubble(ctx, bubble));
      
      // 绘制敌人鱼
      enemies.forEach(enemy => drawFish(ctx, enemy, false));
      
      // 绘制玩家鱼
      drawFish(ctx, player, true);
      
      renderRef.current = requestAnimationFrame(render);
    };
    
    renderRef.current = requestAnimationFrame(render);
    
    return () => {
      if (renderRef.current) {
        cancelAnimationFrame(renderRef.current);
      }
    };
  }, [canvasRef, player, enemies, bubbles]);
  
  return (
    <canvas
      ref={canvasRef}
      width={GAME_CONFIG.canvasWidth}
      height={GAME_CONFIG.canvasHeight}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      className="cursor-none touch-none"
      style={{
        width: '100%',
        height: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        objectFit: 'contain',
      }}
    />
  );
};

export default GameCanvas;

import React from 'react';
import type { GameState, GameStats } from '@/types/game';
import { Play, Pause, RotateCcw, Trophy, Fish, Target, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GameUIProps {
  gameState: GameState;
  stats: GameStats;
  onStart: () => void;
  onPause: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({ gameState, stats, onStart, onPause }) => {
  // 主菜单
  if (gameState === 'menu') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
        <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-white/95">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Fish className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
              大鱼吃小鱼
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-gray-600 text-lg">
              控制你的小鱼，吃掉比你小的鱼，避开比你大的鱼！
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                <p className="text-sm text-gray-600">鼠标/触摸移动</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl text-center">
                <Fish className="w-6 h-6 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-gray-600">吃小鱼长大</p>
              </div>
            </div>
            
            <Button
              onClick={onStart}
              className="w-full h-14 text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Play className="w-6 h-6 mr-2" />
              开始游戏
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 游戏结束
  if (gameState === 'gameOver') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-10">
        <Card className="w-full max-w-md mx-4 border-0 shadow-2xl bg-white/95">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold text-gray-800">
              游戏结束
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500 mb-1">最终得分</p>
                <p className="text-3xl font-bold text-orange-500">{stats.score.toLocaleString()}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl text-center">
                <p className="text-sm text-gray-500 mb-1">最高记录</p>
                <p className="text-3xl font-bold text-yellow-500">{stats.highScore.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 flex items-center">
                  <Fish className="w-4 h-4 mr-1" />
                  吃掉小鱼
                </span>
                <span className="font-bold text-blue-600">{stats.fishEaten} 条</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 flex items-center">
                  <Star className="w-4 h-4 mr-1" />
                  达到等级
                </span>
                <span className="font-bold text-purple-600">Lv.{stats.level}</span>
              </div>
            </div>
            
            <Button
              onClick={onStart}
              className="w-full h-14 text-xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <RotateCcw className="w-6 h-6 mr-2" />
              再玩一次
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 暂停界面
  if (gameState === 'paused') {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-10">
        <Card className="w-full max-w-sm mx-4 border-0 shadow-2xl bg-white/95">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">游戏暂停</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={onPause}
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl"
            >
              <Play className="w-5 h-5 mr-2" />
              继续游戏
            </Button>
            <Button
              onClick={onStart}
              variant="outline"
              className="w-full h-12 text-lg font-bold rounded-xl"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              重新开始
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 游戏中 - 显示HUD
  return (
    <>
      {/* 顶部状态栏 */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="flex justify-between items-start max-w-4xl mx-auto">
          {/* 分数 */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-lg">
            <p className="text-xs text-gray-500 uppercase tracking-wider">得分</p>
            <p className="text-2xl font-bold text-orange-500">{stats.score.toLocaleString()}</p>
          </div>
          
          {/* 中间信息 */}
          <div className="flex gap-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">等级</p>
              <p className="text-xl font-bold text-purple-500">Lv.{stats.level}</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wider">已吃</p>
              <p className="text-xl font-bold text-blue-500">{stats.fishEaten}</p>
            </div>
          </div>
          
          {/* 暂停按钮 */}
          <button
            onClick={onPause}
            className="bg-white/90 backdrop-blur-sm hover:bg-white rounded-2xl p-3 shadow-lg transition-all duration-200"
          >
            <Pause className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* 底部提示 */}
      <div className="absolute bottom-4 left-0 right-0 text-center z-10 pointer-events-none">
        <p className="text-white/70 text-sm drop-shadow-md">
          移动鼠标或触摸屏幕控制鱼儿游动
        </p>
      </div>
    </>
  );
};

export default GameUI;

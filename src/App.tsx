import { useGame } from '@/hooks/useGame';
import { GameCanvas } from '@/components/GameCanvas';
import { GameUI } from '@/components/GameUI';
import './App.css';

function App() {
  const {
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
  } = useGame();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      {/* 游戏画布 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <GameCanvas
          canvasRef={canvasRef}
          player={player}
          enemies={enemies}
          bubbles={bubbles}
          onMouseMove={handleMouseMove}
          onTouchMove={handleTouchMove}
        />
      </div>

      {/* 游戏UI */}
      <GameUI
        gameState={gameState}
        stats={stats}
        onStart={startGame}
        onPause={togglePause}
      />
    </div>
  );
}

export default App;

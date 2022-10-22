// Темы игрового поля
import themes from './themes';
// GameState - объект, который хранит текущее состояние игры
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();

  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
// Рисуем игровое поле, согласно уровня, начальный уровень указан в GameState.js
    this.gamePlay.drawUi(themes[this.gameState.level]);
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}

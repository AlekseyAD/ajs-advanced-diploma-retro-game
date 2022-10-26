// Темы игрового поля
import themes from './themes';
// GameState - объект, который хранит текущее состояние игры
import GameState from './GameState';
// Подключаем составы команд
import Team from './Team';
// Подключаем генератор персонажей и состава команд
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import cursors from './cursors';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.defaultTheme = themes.prairie;
    this.cursors = cursors.pointer;

    this.userHero = Team.playerHeroes();
    this.aiHero = Team.aiHeroes();
    this.playerTeam = [];
    this.aiTeam = [];

    this.level = 1;
    this.playerPositions = [];
    this.aiPositions = [];
    this.allCell = [];

    this.selected = null;
    this.isUsersTurn = true;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    //this.gamePlay.drawUi(themes[this.level]);
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.startGame();

    // console.log(this.allCell[0].position);
    // console.log(this.aiPositions[0].position);
    // console.log(this.playerTeam.length);
    //console.log(this.selected);
  }

  startGame() {
    if (this.level === 1) {
      this.playerTeam = generateTeam(Team.playerHeroes(), 1, 2);
      this.aiTeam = generateTeam(Team.aiHeroes(), 1, 2);
      this.positionTeams(this.playerTeam, this.aiTeam);
      this.allCell.push(...this.playerPositions, ...this.aiPositions);
    }
    const coordinates = this.getPositions(this.playerPositions.length);
    for (let i = 0; i < this.playerPositions.length; i += 1) {
      this.playerPositions[i].position = coordinates.user[i];
      this.aiPositions[i].position = coordinates.ai[i];
    }
    //console.log(this.playerTeam);
    //console.log(coordinates);
    //console.log(this.playerPositions.length);
    this.gamePlay.drawUi(this.defaultTheme);
    this.gamePlay.redrawPositions([
      ...this.playerPositions,
      ...this.aiPositions,
    ]);

    // console.log(this.playerPositions);
    // console.log(this.aiPositions);
  }

  positionTeams(playerTeam, aiTeam) {
    for (let i = 0; i < playerTeam.length; i += 1) {
      this.playerPositions.push(new PositionedCharacter(playerTeam[i], 0));
    }
    for (let i = 0; i < aiTeam.length; i += 1) {
      this.aiPositions.push(new PositionedCharacter(aiTeam[i], 0));
    }
    // console.log(this.playerPositions);
    // console.log(this.aiPositions);
  }

  randomPosition(column = 0) {
    return (
      Math.floor(Math.random() * 8) * 8 +
      (Math.floor(Math.random() * 2) + column)
    );
  }

  getPositions(length) {
    const position = {
      user: [],
      ai: [],
    };
    let random;
    for (let i = 0; i < length; i += 1) {
      do {
        random = this.randomPosition();
      } while (position.user.includes(random));
      position.user.push(random);

      do {
        random = this.randomPosition(6);
      } while (position.ai.includes(random));
      position.ai.push(random);
    }

    return position;
  }

  onCellClick(index) {
    // TODO: react to click
    

    this.gameState.selected = index;

    if (this.getPositionedCharacter(index) && this.thisUser(index)) {
      this.gamePlay.cells.forEach((element) =>
        element.classList.remove('selected-green')
      );
      this.gamePlay.cells.forEach((element) =>
        element.classList.remove('selected-yellow')
      );
      this.gamePlay.selectCell(index);
      this.gameState.selected = index;
    }
    if (this.gameState.level === 2 || this.playerTeam.length === 0) {
      return;
    }

    // Реализация атаки
    if (
      this.gameState.selected !== null &&
      this.getPositionedCharacter(index) &&
      this.thisBotChar(index)
    ) {
      if (this.isAttack(index)) {
        this.getAttack(index, this.gameState.selected);
      }
    }
    //console.log(index);
    console.log(this.isMoving(index));
    // console.log(this.getPositionedCharacter(index));
    //console.log(this.thisBotChar(index));
    // перемещение персонажа игрока
    //if (this.selected !== null && this.isMoving(index) && !this.getPositionedCharacter(index)) {
    if (this.isMoving(index)) {
      if (this.isUsersTurn) {
        this.getUsersTurn(index);
      }
    }

    // Если не валидный ход, то показываем сообщение об ошибке
    if (
      this.gameState.selected !== null &&
      !this.isMoving(index) &&
      !this.isAttack(index)
    ) {
      if (this.gameState.isUsersTurn && !this.getPositionedCharacter(index)) {
        GamePlay.showError('Недопустимый ход');
      }
    }

    // Если ячейка пустая то при клике на неё return
    if (!this.getPositionedCharacter(index)) {
      return;
    }

    // Если клик на бота, то показываем сообщение об ошибке
    if (
      this.getPositionedCharacter(index) &&
      this.thisBotChar(index) &&
      !this.isAttack(index)
    ) {
      alert('Это не ваш персонаж');
    }
  }

  onCellEnter(index) {
    if (this.thisUser(index)) {
      this.gamePlay.selectCell(index);
    }

    // TODO: react to mouse enter
    if (this.getPositionedCharacter(index)) {
      const hero = this.getPositionedCharacter(index).character;
      const message = `\u{1F538}${hero.class}\u{1F396}${hero.level}\u{2694}${hero.attack}\u{1F6E1}${hero.defence}\u{2764}${hero.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }

    // Если в ячейке персонаж игрока, то при наведении на ячейку курсор = pointer
    if (this.getPositionedCharacter(index) && this.thisUser(index)) {
      this.gamePlay.setCursor(cursors.pointer);
    }
    // Если валидный диапазон перемещения, то при наведении выделяем ячейку зелёным
    if (
      this.gameState.selected !== null &&
      !this.getPositionedCharacter(index) &&
      this.isMoving(index)
    ) {
      this.gamePlay.setCursor(cursors.pointer);
      this.gamePlay.selectCell(index, 'green');
    }
    // Если валидный диапазон атаки, то при наведении выделяем ячейку красным
    if (
      this.gameState.selected !== null &&
      this.getPositionedCharacter(index) &&
      !this.thisUser(index)
    ) {
      if (this.isAttack(index)) {
        this.gamePlay.setCursor(cursors.crosshair);
        this.gamePlay.selectCell(index, 'red');
      }
    }
    // Если не валидные диапазоны атаки и перемещения и бот, то при наведении курсор = notallowed
    if (
      this.gameState.selected !== null &&
      !this.isAttack(index) &&
      !this.isMoving(index)
    ) {
      if (!this.thisUser(index)) {
        this.gamePlay.setCursor(cursors.notallowed);
      }
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.cells.forEach((elem) =>
      elem.classList.remove('selected-red')
    );
    this.gamePlay.cells.forEach((elem) =>
      elem.classList.remove('selected-green')
    );
    //this.gamePlay.hideCellTooltip(index);
    //this.gamePlay.setCursor(cursors.auto);
  }

  thisUser(index) {
    if (this.getPositionedCharacter(index)) {
      const user = this.getPositionedCharacter(index).character;
      return this.userHero.some((element) => user instanceof element);
    }
    return false;
  }
  thisBotChar(index) {
    if (this.getPositionedCharacter(index)) {
      const ai = this.getPositionedCharacter(index).character;
      return this.aiHero.some((elem) => ai instanceof elem);
    }
    return false;
  }
  getPositionedCharacter(index) {
    return this.allCell.find((element) => element.position === index);
  }

  getSelectedChar() {
    return this.allCell.find(
      (elem) => elem.position === this.gameState.selected
    );
  }

  isMoving(idx) {
    if (this.getSelectedChar()) {
      const moving = this.getSelectedChar().character.distance;
      const arr = this.calcRange(this.gameState.selected, moving);
      return arr.includes(idx);
    }
    return false;
  }
  getUsersTurn(idx) {
    this.getSelectedChar().position = idx;
    this.gamePlay.deselectCell(this.gameState.selected);
    this.gamePlay.redrawPositions(this.allCell);
    this.gameState.selected = idx;
    this.gameState.isUsersTurn = false;
    //this.getBotsResponse();
  }
  isAttack(idx) {
    if (this.getSelectedChar()) {
      const stroke = this.getSelectedChar().character.attackRange;
      const arr = this.calcRange(this.gameState.selected, stroke);
      return arr.includes(idx);
    }
    return false;
  }

  calcRange(idx, char) {
    const brdSize = this.gamePlay.boardSize;
    const range = [];
    const leftBorder = [];
    const rightBorder = [];

    for (
      let i = 0, j = brdSize - 1;
      leftBorder.length < brdSize;
      i += brdSize, j += brdSize
    ) {
      leftBorder.push(i);
      rightBorder.push(j);
    }

    for (let i = 1; i <= char; i += 1) {
      range.push(idx + brdSize * i);
      range.push(idx - brdSize * i);
    }

    for (let i = 1; i <= char; i += 1) {
      if (leftBorder.includes(idx)) {
        break;
      }
      range.push(idx - i);
      range.push(idx - (brdSize * i + i));
      range.push(idx + (brdSize * i - i));
      if (leftBorder.includes(idx - i)) {
        break;
      }
    }

    for (let i = 1; i <= char; i += 1) {
      if (rightBorder.includes(idx)) {
        break;
      }
      range.push(idx + i);
      range.push(idx - (brdSize * i - i));
      range.push(idx + (brdSize * i + i));
      if (rightBorder.includes(idx + i)) {
        break;
      }
    }

    return range.filter((elem) => elem >= 0 && elem <= brdSize ** 2 - 1);
  }
}

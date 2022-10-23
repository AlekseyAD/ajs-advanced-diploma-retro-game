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
const icons = {
  level: '\u{1F396}',
  attack: '\u{2694}',
  defence: '\u{1F6E1}',
  health: '\u{2764}',
};
function getInfoCharacter(character) {
  return `${icons.level}${character.level} ${icons.attack}${character.attack} ${icons.defence}${character.defence} ${icons.health}${character.health}`;
}

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.defaultTheme = themes.prairie;
    this.cursors = cursors.pointer;
    this.playerTeam = [];
    this.aiTeam = [];
    this.level = 1;
    this.playerPositions = [];
    this.aiPositions = [];
    this.allCell = [];
    //this.boardLocked = false;
    this.selectedCell = false;
    this.selectedCharacter = {};
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    //this.gamePlay.drawUi(themes[this.level]);
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gameStart();
  }
 
  gameStart() {
    if (this.level === 1) {
      this.playerTeam = generateTeam(Team.playerHeroes(), 1, 2);
      this.aiTeam = generateTeam(Team.aiHeroes(), 1, 2);
      this.positionTeams(this.playerTeam, this.aiTeam);
      this.allCell.push(...this.playerPositions, ...this.aiPositions);
      console.log(this.playerTeam);
      //console.log(this.allCell);
      //console.log(this.positionTeams);
    }
    const characterPositions = this.getPositions(this.playerPositions.length);
    for (let i = 0; i < this.playerPositions.length; i += 1) {
      this.playerPositions[i].position = characterPositions.user[i];
      this.aiPositions[i].position = characterPositions.ai[i];
    }
    this.gamePlay.drawUi(this.defaultTheme);
    this.gamePlay.redrawPositions([
      ...this.playerPositions,
      ...this.aiPositions,
    ]);
  }

  positionTeams(playerTeam, aiTeam) {
    for (let i = 0; i < playerTeam.length; i += 1) {
      this.playerPositions.push(new PositionedCharacter(playerTeam[i], 0));
    }
    for (let i = 0; i < aiTeam.length; i += 1) {
      this.aiPositions.push(new PositionedCharacter(aiTeam[i], 0));
    }
   //console.log(this.aiPositions);
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
    //console.log(this.getId(index));
    console.log(this.isUser(index));
    if (this.getId(index) && this.isUser(index)) {
     
      //this.gamePlay.cells.forEach((element) => element.classList.remove('selected-green'));
      this.gamePlay.cells.forEach((element) => element.classList.remove('selected-yellow'));
      this.gamePlay.selectCell(index);
      this.gameState.selected = index;
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.getId(index)) {
      const hero = this.getId(index).character;
      const message = `\u{1F538}${hero.class}\u{1F396}${hero.level}\u{2694}${hero.attack}\u{1F6E1}${hero.defence}\u{2764}${hero.health}`;
      this.gamePlay.showCellTooltip(message, index);
    }

  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    // if (this.selectedCharacter.position !== index) {
    //   this.gamePlay.deselectCell(index);
    // }
    // this.gamePlay.hideCellTooltip(index);
    // this.gamePlay.setCursor(cursors.auto);
  }
  getIndex(arr) {
    return arr.findIndex((item) => item.position === this.index);
  }

  isUser(id) {
    if (this.getId(id)) {
     
      //const array = [Magician, Bowman, Swordsman];

     const character = this.getId(id).character;
      console.log(character);
       //console.log(this.getId(index));
     return this.this.playerTeam.some((element) => character instanceof element);
    }
    return false;
  }
  
  getId(id) {
   // const arr = [...this.playerPositions, ...this.aiPositions];
    return this.allCell.find((element) => element.position === id);
  }

}

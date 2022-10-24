import Bowman from '../Characters/Bowman';
import GameController from '../GameController';
import GamePlay from '../GamePlay';
import PositionedCharacter from '../PositionedCharacter';
import Swordsman from '../Characters/Swordsman';
import Vampire from '../Characters/Vampire';
import GameStateService from '../GameStateService';
import Daemon from '../Characters/Daemon';

test('Проверяем создание персонажа в указанной ячейке', () => {
  const posBowman = new PositionedCharacter(new Bowman(1), 1);
  const posSwordsman = new PositionedCharacter(new Swordsman(1), 24);
  const posVampire = new PositionedCharacter(new Vampire(1), 30);
  const posDaemon = new PositionedCharacter(new Daemon(1), 33);

  const testGame = new GameController(new GamePlay(), GameStateService);
  testGame.allCell.push(posBowman, posSwordsman, posVampire, posDaemon);
  
  expect(testGame.allCell[0].position).toEqual(1);
  expect(testGame.allCell[1].position).toEqual(24);
  expect(testGame.allCell[2].position).toEqual(30);
  expect(testGame.allCell[3].position).toEqual(33);
  expect(testGame.allCell.length).toBe(4);
});


// test('метод isUserChar должен проверить наличие персонажа игрока по индексу', () => {
//   expect(GameController.thisUser(24)).toBeTruthy();
//   expect(GameController.thisUser(30)).toBeFalsy();
//   expect(GameController.thisUser(1)).toBeTruthy();
// });
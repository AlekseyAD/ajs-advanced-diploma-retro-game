/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
import Bowman from './Characters/Bowman';
import Swordsman from './Characters/Swordsman';
import Daemon from './Characters/Daemon';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';
import Magician from './Characters/Magician';

export default class Team {
  // TODO: write your logic here
  constructor() {
    this.userHero = [Bowman, Swordsman, Magician];
  }
  static playerHeroes() {
    return [Magician, Bowman, Swordsman];
  }

  static aiHeroes() {
    return [Daemon, Undead, Vampire];
  }
  
}

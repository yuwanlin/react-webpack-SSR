import {
  observable,
  computed,
  action
} from 'mobx';

export default class AppState {
  constructor({ count, name } = { count: 0, name: 'real' }) {
    this.count = count;
    this.name = name;
  }
  @observable name;
  @observable count;
  @computed get msg() {
    return `${this.name} say count is ${this.count}`;
  }
  @action add() {
    this.count += 1;
  }
  toJson() {
    return {
      count: this.count,
      name: this.name
    }
  }
}

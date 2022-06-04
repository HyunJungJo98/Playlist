export class LocalStorage {
  private static instance: LocalStorage;

  private constructor() {}

  static getInstance() {
    if (LocalStorage.instance) {
      return this.instance;
    } else {
      this.instance = new LocalStorage();
      return this.instance;
    }
  }

  saveLocalStorage(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getLocalStorage(key: string) {
    const getLocalData = localStorage.getItem(key)!;
    const parseGetLocalData = JSON.parse(getLocalData);
    return parseGetLocalData;
  }
}

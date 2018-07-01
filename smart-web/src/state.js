export class State {
  constructor(){
    this.profile = {};
    this.ID = Math.ceil(Math.random() * 1000);
  }

  setProfile(profile) {
    this.profile = profile;
  }

  nullProfile() {
    this.profile = {};
  }

}

import { inject } from 'aurelia-framework';
import { AuthService } from 'aurelia-authentication';
import { Config } from 'aurelia-api';

@inject(AuthService, Config)
export class Profile {
  authService;
  apiService;
  name;
  role;
  municipality

  constructor(authService, config) {
    this.authService = authService;
    this.apiService = config.getEndpoint('protected-api');
  }

  attached() {
    this.authService.getMe()
      .then(response => {
        console.log(response);
        this.name = response.name;
        this.role = response.role;
        this.municipality = response.municipality;
      });
    this.apiService.find('/Identity')
      .then(response => {
        this.claims = response;
      })
  };
}

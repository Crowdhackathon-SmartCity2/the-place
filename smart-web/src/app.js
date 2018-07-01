import { PLATFORM, inject, computedFrom } from 'aurelia-framework';
import { Router, RouterConfiguration } from 'aurelia-router';
import { AuthService, AuthenticateStep, AuthorizeStep } from 'aurelia-authentication';
import { State } from './state';

@inject(AuthService, State)
export class App {

  constructor(authService, state) {
    this.authService = authService;
    this.state = state;
  };

  activate() {
    if (this.authService.isAuthenticated()) {
      return this.authService.getMe()
        .then(response => {
          this.state.setProfile(response);
        });
    }
  }

  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.options.pushState = true;
    config.options.root = '';
    config.addPipelineStep('authorize', AuthenticateStep);
    config.map([
      { 
        route: ['', '/', 'home'], 
        name: 'home', 
        moduleId: PLATFORM.moduleName('./home/home'),
        nav: true,
        title: 'SMART'
      },
      {
        route: 'profile',
        name: 'profile',
        moduleId: PLATFORM.moduleName('./profile/profile'),
        title: 'Profile',
        auth: true
      },
      {
        route: 'collect',
        name:  'collect',
        moduleId: PLATFORM.moduleName('./collect/collect'),
        nav: true,
        title: 'Collect Bins',
        auth: true,
        settings: {
          role: 'driver'
        }
      },
      {
        route: 'dashboard',
        name:  'dashboard',
        moduleId: PLATFORM.moduleName('./user-dashboard/user-dashboard'),
        nav: true,
        title: 'Dashboard',
        auth: true,
        settings: {
          role: 'user'
        }
      },
      {
        route: 'dashboard',
        name:  'dashboard',
        moduleId: PLATFORM.moduleName('./admin-dashboard/admin-dashboard'),
        nav: true,
        title: 'Dashboard',
        auth: true,
        settings: {
          role: 'admin'
        }
      }
    ]);
    this.router = router;
  }

  @computedFrom('authService.authenticated')
  get authenticated() {
    return this.authService.authenticated;
  }

  authenticate() {
    return this.authService.authenticate('identityServer', '')
      .then((response) => {
        this.authService.getMe()
          .then(response => this.state.setProfile(response))
      });
  }

  logout() {
    return this.authService.logout()
      // delete cookies manually (stupid Identity Server)
      .then(response => fetch('http://localhost:5000/Account/RemoveCookies', {
        method: 'POST',
        credentials: 'include'
      }))
      .then(response => this.state.nullProfile());
  }
}

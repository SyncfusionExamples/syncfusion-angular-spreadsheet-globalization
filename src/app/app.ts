import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [RouterModule, CommonModule],
  selector: 'app-root',
  template: `
    <div class="app-container">
      <nav class="navbar">
        <h2>Syncfusion Spreadsheet Samples</h2>
        <ul class="nav-links">
          <li><a routerLink="/globalization" routerLinkActive="active">Localization Sample</a></li>
          <li><a routerLink="/rtl" routerLinkActive="active">RTL Sample</a></li>
        </ul>
      </nav>
      <div class="content">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .navbar h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
    }
    .nav-links {
      list-style: none;
      display: flex;
      gap: 15px;
      margin: 0;
      padding: 0;
    }
    .nav-links li a {
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      transition: all 0.3s ease;
      display: inline-block;
    }
    .nav-links li a:hover {
      background-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    .nav-links li a.active {
      background-color: rgba(255, 255, 255, 0.3);
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }
    .content {
      flex: 1;
      overflow: auto;
      background-color: #f5f5f5;
    }
  `]
})
export class App {
  title = 'Spreadsheet Samples';
}
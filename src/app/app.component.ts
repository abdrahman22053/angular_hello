import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';

// Définition de l'animation
export const bounceAndRotate = trigger('bounceAndRotate', [
  transition(':enter', [
    animate('1s ease-in-out', keyframes([
      style({ opacity: 0, transform: 'scale(0.1) rotate(0deg)', offset: 0 }),
      style({ opacity: 1, transform: 'scale(1.2) rotate(180deg)', offset: 0.5 }),
      style({ opacity: 1, transform: 'scale(1) rotate(360deg)', offset: 1 })
    ]))
  ]),
  transition(':leave', [
    animate('0.8s ease-in-out', keyframes([
      style({ opacity: 1, transform: 'scale(1) rotate(360deg)', offset: 0 }),
      style({ opacity: 0.5, transform: 'scale(1.2) rotate(180deg)', offset: 0.5 }),
      style({ opacity: 0, transform: 'scale(0.1) rotate(0deg)', offset: 1 })
    ]))
  ])
]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [bounceAndRotate] // Ajout de l'animation
})
export class AppComponent {
  title = 'angular-hello';
  isVisible = true;

  toggleVisibility() {
    this.isVisible = !this.isVisible;
  }
}
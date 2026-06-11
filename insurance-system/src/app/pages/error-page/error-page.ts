import { Component } from '@angular/core';
import { Footer } from '../../components/footer/footer';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-error-page',
  imports: [NavbarComponent, Footer, RouterLink],
  templateUrl: './error-page.html',
  styleUrl: './error-page.css',
})
export class ErrorPage {}

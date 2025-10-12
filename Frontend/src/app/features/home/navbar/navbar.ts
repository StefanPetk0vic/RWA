import { Component } from '@angular/core';
import { ThemeController } from '../theme-controller/theme-controller';
import { Avatar } from '../avatar/avatar';
import { Drawer } from '../drawer/drawer';
@Component({
  selector: 'app-navbar',
  imports: [ThemeController,Avatar,Drawer],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {

}

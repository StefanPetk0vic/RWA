import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-verified-card',
  imports: [CommonModule],
  templateUrl: './verified-card.html',
  styleUrls: ['./verified-card.scss'],
})
export class VerifiedCard {
  @Input() glowIntensity = 1.5;
  @Input() rotationFactor = 25;
  @Input() shadowColor = 'rgba(0,0,0,0.2)';

  cardStyle: any = {};
  holographicGradient = this.generateGradient(45);

  private generateGradient(angle: number) {
    return `linear-gradient(${angle}deg, hsl(200,60%,90%), hsl(280,70%,85%), hsl(340,80%,88%))`;
  }

  private setCardStyle(transform: string, shadow: string, transition = '0.05s') {
    this.cardStyle = {
      transform,
      boxShadow: shadow,
      transition: `transform ${transition} ease-out`,
    };
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const { width, height, left, top } = (event.target as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - left) / width - 0.5;
    const y = (event.clientY - top) / height - 0.5;
    const transform = `perspective(1000px) rotateX(${-y * this.rotationFactor}deg) rotateY(${
      x * this.rotationFactor
    }deg) scale(1.05)`;
    const shadow = `0 15px 40px -15px ${this.shadowColor}, 0 0 ${
      this.glowIntensity * 25
    }px rgba(255,255,255,0.25)`;
    this.setCardStyle(transform, shadow);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.setCardStyle(
      'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
      `0 10px 30px -10px ${this.shadowColor}`,
      '0.5s'
    );
  }
}

import { trigger, state, style, transition, animate } from "@angular/animations";

export const smoothExpandCollapse = (opacity: number = 0, height: number = 0, time: number = 200, selector: string = 'fadeInOut') => {
  return trigger(selector, [
    state("void", style({
        opacity: opacity,
        height: height
      })
    ),
    transition("void <=> *", animate(time))
  ])
}


export const grow = (duration = 200, easing = 'linear') => {
  return trigger('grow', [
    state('no', style({
      transform: 'scale(1)'
    })),
    state('yes', style({
      transform: 'scale(1.4)'
    })),
    transition('* => *', animate(`${duration}ms ${easing}`))
  ]);
};

export const slide = trigger('slide', [
  state('in', style({
    transform: 'translate3d(0, 0, 0)'
  })),
  state('out', style({
    transform: 'translate3d(150%, 0, 0)'
  })),
  transition('in => out', animate('200ms ease-in')),
  transition('out => in', animate('200ms ease-out'))
]);

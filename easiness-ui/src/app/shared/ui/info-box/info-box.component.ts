import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-info-box',
  template: `
  <div id="info-box" 
    class="p-2 border border-1 border-info bg-info bg-soft text-monospace fw-bold rounded"> 
    <ng-content></ng-content> 
  </div>`,
})
export class InfoBoxComponent  {
  
}

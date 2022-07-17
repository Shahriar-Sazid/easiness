import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-search-options",
  templateUrl: "./search-options.component.html",
  styleUrls: ["./search-options.component.scss"],
})
export class SearchOptionsComponent implements OnInit {
  panelClosed: boolean;
  @Input() panelTitle: string;
  constructor() {}

  ngOnInit() {
    this.panelClosed = false;
  }

  onPanelToggle() {
    this.panelClosed = !this.panelClosed;
  }
}

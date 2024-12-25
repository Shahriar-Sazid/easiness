import { Injectable } from '@angular/core';
import { EventService } from '../event.service';

@Injectable({
  providedIn: 'root'
})
export class EventIpcService {
  constructor(private eventService: EventService) {}

  broadcast(type: string, payload = {}) {
    // IPC logic to broadcast event
    this.eventService.broadcast(type, payload);
  }

  subscribe(type: string, callback) {
    // IPC logic to subscribe to event
    return this.eventService.subscribe(type, callback);
  }
}

import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map, filter } from 'rxjs/operators';

interface Event {
    type: string;
    payload?: any;
}

type EventCallback = (payload: any) => void;

@Injectable({
    providedIn: 'root'
})
export class EventService {
    private handler = new Subject<Event>();

    constructor() {
        // Subscribe to events from the main process when the service initializes
        (window as any).electronAPI.onEvent((event: Event) => {
            this.handler.next(event);
        });
    }

    /**
     * Broadcast the event
     * @param type type of event
     * @param payload payload
     */
    broadcast(type: string, payload = {}) {
        this.handler.next({ type, payload });

        // Send the event to the main process via IPC
        (window as any).electronAPI.broadcastEvent({ type, payload })
            .catch(error => console.error('Failed to broadcast event to IPC', error));
    }

    /**
     * Subscribe to event
     * @param type type of event
     * @param callback call back function
     */
    subscribe(type: string, callback: EventCallback): Subscription {
        return this.handler.pipe(
            filter(event => event.type === type),
            map(event => event.payload)
        ).subscribe(callback);
    }
}

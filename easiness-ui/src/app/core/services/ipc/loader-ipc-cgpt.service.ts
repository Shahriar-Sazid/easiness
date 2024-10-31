import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  public isLoading = new BehaviorSubject<boolean>(false);

  constructor() { }

  // Add a method to manage loading state through IPC
  setLoadingState(state: boolean) {
    this.isLoading.next(state);
    (window as any).electronAPI.setLoadingState(state);
  }

  // Method to get the loading state from IPC if needed
  getLoadingStateFromIPC(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      (window as any).electronAPI.getLoadingState()
        .then((state: boolean) => resolve(state))
        .catch((error: any) => reject(error));
    });
  }
}

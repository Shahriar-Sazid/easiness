import { Injectable } from '@angular/core';
import { LoaderService } from '../loader.service';

@Injectable({
  providedIn: 'root'
})
export class LoaderIpcService {
  constructor(private loaderService: LoaderService) {}

  get isLoading() {
    // IPC logic to get loading status
    return this.loaderService.isLoading;
  }
}

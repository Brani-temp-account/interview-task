import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThankYouPageService {
  // This service holds the data for TY page. If this was done with angular
  // routing, I would probably prefer sending it as queryParams

  responseSuccess = signal(false);
}

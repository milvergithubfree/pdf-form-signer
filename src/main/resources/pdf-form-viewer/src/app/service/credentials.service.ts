import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Credentials } from "@models/credentials";

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  private credentials: BehaviorSubject<Credentials>
  constructor() {
    const credential: Credentials = {
      accessToken: "",
      expiresIn: 0,
      scope: "",
      tokenType: "",
    }
    this.credentials = new BehaviorSubject<Credentials>(credential);
  }

  public getCredentials(): Credentials {
    return this.credentials.value;
  }

  public setCredentials(credentials: Credentials): void {
    this.credentials.next(credentials);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { DocumentSignProcess } from "@models/document-sign-process";
import { TspDemoidasAuth } from "@models/tsp.demoidas.auth";
import { Observable } from "rxjs";
import { environment } from "@env/environment";
import { Credentials } from "@models/credentials";
import { CredentialsService } from "@service/credentials.service";

@Injectable({
  providedIn: 'root'
})
export class TspdemoeidasService {


  constructor(private httpClient: HttpClient, private credentialService: CredentialsService,) { }

  private getAuthenticationCredentials(): Observable<TspDemoidasAuth> {
    return this.httpClient.get<TspDemoidasAuth>(environment.tspdemoeidas.tspdemoidasToken);
  }

  public async authenticate(): Promise<void> {
    const value: TspDemoidasAuth | undefined = await this.getAuthenticationCredentials().toPromise()

    const credentials: Credentials = {
      accessToken: value?.access_token || "",
      expiresIn: value?.expires_in || 0,
      scope: value?.scope || "",
      tokenType: value?.token_type || "",
    }
    this.credentialService.setCredentials(credentials);
  }

  public createDocumentSignature(process: File, pdfFile: File): Observable<DocumentSignProcess> {
    const formData = new FormData();
    formData.append("process", process, "process.json");
    formData.append("document", pdfFile, "document.pdf");

    return this.httpClient.post<DocumentSignProcess>(`${environment.tspdemoeidas.trustedxResources}/signer_processes`, formData);
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  FormDataType, LinkTarget,
  NgxExtendedPdfViewerService,
  pdfDefaultOptions,
  ProgressBarEvent
} from 'ngx-extended-pdf-viewer';
import { ActivatedRoute } from "@angular/router";
import { SupabaseService } from "@service/supabase.service";
import { environment } from "@env/environment";
import { TspdemoeidasService } from "@service/tspdemoeidas.service";

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewerComponent implements OnInit {

  public url: string = '';
  protected fileName: string = '';
  private proccess =   {
    "process_type": "urn:safelayer:eidas:processes:sign:esigp",
    "signer": {
      "signature_policy_id": "urn:safelayer:eidas:policies:sign:document:pdf",
      "parameters": {
        "type": "pdf",
        "default_digest_algorithm": "sha256",
        "location": "Uruguay, Montevideo",
        "signature_field": {
          "name": "User_Signature",
          "location": {
            "page": {
              "number": "last"
            },
            "rectangle": {
              "x": 100,
              "y": 110,
              "height": 150,
              "width": 400
            }
          },
          "appearance": {
            "signature_details": {
              "details": [{
                "type": "subject",
                "title": "Signer Distinguished Name: "
              },
                {
                  "type": "location",
                  "title": "Signature Location: "
                },
                {
                  "type": "date",
                  "title": "Signature date: "
                }]
            }
          }
        }
      }
    },
    "labels" : [["cualificado", "server"]],
    "views": {
      "document_agreement": {
        "document_info": {
          "html_body_content": "PGgxPkRvY3VtZW50b3MgYSBmaXJtYXI8L2gxPjxwPlZlcmlmaXF1ZSBsb3MgZG9jdWVtbnRvczwvcD4="
        }
      }
    },
    "finish_callback_url": "http://localhost"
  };
  constructor(private ngxService: NgxExtendedPdfViewerService,
              private supabaseService: SupabaseService,
              private tspdemoeidasService: TspdemoeidasService,
              private route: ActivatedRoute) {
    /* More likely than not you don't need to tweak the pdfDefaultOptions.
       They are a collecton of less frequently used options.
       To illustrate how they're used, here are two example settings: */
    pdfDefaultOptions.doubleTapZoomFactor = '100%'; // The default value is '200%'
    pdfDefaultOptions.maxCanvasPixels = 4096 * 4096 * 5; // The default value is 4096 * 4096 pixels,
    // but most devices support much higher resolutions.
    // Increasing this setting allows your users to use higher zoom factors,
    // trading image quality for performance.
    pdfDefaultOptions.externalLinkTarget = LinkTarget.BLANK;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.fileName = params.get('id') || '';
      this.url = `${environment.supabaseUrl}/${environment.pathUrl}/${environment.pathBucket}/${id}.pdf`;
    });
  }

  public onProgress(evt: ProgressBarEvent): void {
    console.log(evt.percent);
  }

  public setFormData(formData: FormDataType): void {
    console.log(formData)
  }

  public async saveFileOnStorage(): Promise<void> {
    const blob = await this.ngxService.getCurrentDocumentAsBlob();
    if (blob) {

      const filename = String(Date.now());
      const fileType = "application/pdf";
      const blobPart = blob as BlobPart;
      const file = new File([blobPart], filename, { type: fileType });

      const result = await this.supabaseService.updateFile(file, this.fileName);
      console.log(result)
    }
  }

  public async saveFormData(): Promise<void> {
    const raw = await this.ngxService.getFormData(true);
    const rawFormData = raw.map((annotation: any) => ({
      alternativeText: annotation.fieldAnnotation.alternativeText,
      fieldName: annotation.fieldAnnotation.fieldName,
      fieldType: annotation.fieldAnnotation.fieldType,
      fieldValue: annotation.fieldAnnotation.fieldValue,
      value: annotation.fieldAnnotation.value,
      id: annotation.fieldAnnotation.id,
      maxLen: annotation.fieldAnnotation.maxLen,
      rect: annotation.fieldAnnotation.rect
    }));
    console.log(rawFormData)
  }

  public async signDocument() {
    const jsonBlob = new Blob([JSON.stringify(this.proccess)], { type: 'application/json' });

    const pdfBlob = await this.ngxService.getCurrentDocumentAsBlob();
    if (pdfBlob) {

      const filename = String(Date.now());
      const fileType = "application/pdf";
      const pdfBlobPart = pdfBlob as BlobPart;
      const pdfFile = new File([pdfBlobPart], filename, { type: fileType });
      const jsonFile = new File([jsonBlob], "process.json", { type: 'application/json' });

      const result = await this.tspdemoeidasService.createDocumentSignature(jsonFile, pdfFile).toPromise();

      const continueSignUrl = result?.tasks.pending[0].url;
      window.open(continueSignUrl, "_blank");
    }
  }
}

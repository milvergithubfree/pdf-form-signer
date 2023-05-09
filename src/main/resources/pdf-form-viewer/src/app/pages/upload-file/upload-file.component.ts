import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxDropzoneChangeEvent } from "ngx-dropzone";
import { SupabaseService } from "@service/supabase.service";

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent {
  protected files: File[] = [];
  protected fileName = Date.now();

  protected isLoading: boolean = false;

  constructor(private supabaseService: SupabaseService, private router: Router) {
  }

  onSelect(event: NgxDropzoneChangeEvent) {
    this.files = [];
    this.files.push(...event.addedFiles);
    this.isLoading = true;
    this.continueUploadFile();
  }

  onRemove(event: File) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  async continueUploadFile(): Promise<void> {
    this.fileName = Date.now();
    try {
      this.isLoading = true;
      const result = await this.supabaseService.uploadFile(this.files[0], String(this.fileName));
      console.log(result);
      await this.router.navigate(['documentview', this.fileName]);
    } catch (e) {
      console.log(e);
    } finally {
      this.isLoading = false;
    }
  }
}

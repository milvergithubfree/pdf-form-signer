import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadFileComponent } from "@pages/upload-file/upload-file.component";
import { DocumentViewerComponent } from "@pages/document-viewer/document-viewer.component";

const routes: Routes = [
  {
    path: "",
    component: UploadFileComponent,
  },
  {
    path: "documentview/:id",
    component: DocumentViewerComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

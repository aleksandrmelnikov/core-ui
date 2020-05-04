import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { KeyValue, WorkflowTemplate, WorkspaceTemplate, WorkspaceTemplateServiceService } from "../../../../api";
import { ActivatedRoute } from "@angular/router";
import { map } from "rxjs/operators";
import { LabelsEditComponent } from "../../../labels/labels-edit/labels-edit.component";
import { ManifestDagEditorComponent } from "../../../manifest-dag-editor/manifest-dag-editor.component";

@Component({
  selector: 'app-workspace-template-edit',
  templateUrl: './workspace-template-edit.component.html',
  styleUrls: ['./workspace-template-edit.component.scss']
})
export class WorkspaceTemplateEditComponent implements OnInit {
  @ViewChild(ManifestDagEditorComponent, {static: false}) manifestDagEditor: ManifestDagEditorComponent;
  @ViewChild(LabelsEditComponent, {static: false}) labelEditor: LabelsEditComponent;

  @Input() namespace: string;

  private _workspaceTemplate: WorkspaceTemplate;
  @Input() set workspaceTemplate(value: WorkspaceTemplate) {
    if(value && this._workspaceTemplate && value.name === this._workspaceTemplate.name) {
      return;
    }

    this._workspaceTemplate = value;
    this.getWorkspaceTemplateVersions();
  }

  get workspaceTemplate(): WorkspaceTemplate {
    return this._workspaceTemplate;
  }

  @Output() cancelEmitted = new EventEmitter();
  @Output() saveEmitted = new EventEmitter<WorkspaceTemplate>();

  manifest = "";
  templateNameInput: AbstractControl;
  form: FormGroup;
  labels = new Array<KeyValue>();
  apiManifestInterceptor = undefined;

  selectedWorkspaceTemplateVersion: string = "";
  workspaceTemplateVersions: WorkflowTemplate[] = [];

  constructor(
      private formBuilder: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private workspaceTemplateService: WorkspaceTemplateServiceService,
  ) {
    this.form = this.formBuilder.group({
      templateNameInput: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ]});

    this.templateNameInput = this.form.get('templateNameInput');
  }

  ngOnInit() {
    this.apiManifestInterceptor = (newManifest: string) => {
      const body = {
        manifest: newManifest,
      }
      return this.workspaceTemplateService.generateWorkspaceTemplateWorkflowTemplate(this.namespace, 'generated', body)
          .pipe(
              map(res => res.manifest)
          );
    }
  }

  getWorkspaceTemplateVersions() {
    this.workspaceTemplateService.listWorkspaceTemplateVersions(this.namespace, this.workspaceTemplate.uid)
        .subscribe(res => {
          if(res.workspaceTemplates && res.workspaceTemplates.length > 0) {
            console.log('setting manifest to', res.workspaceTemplates[0]);
            this.selectedWorkspaceTemplateVersion = res.workspaceTemplates[0].version;
            this.workspaceTemplateVersions = res.workspaceTemplates;
            this.manifest = res.workspaceTemplates[0].manifest;
            this.manifestDagEditor.onManifestChange(this.manifest);
          }
        })
  }

  cancel() {
    this.cancelEmitted.emit();
  }

  save() {
    const templateName = this.templateNameInput.value;

    if(!templateName) {
      return;
    }

    if(!this.labelEditor.isValid) {
      this.labelEditor.markAllAsDirty();
      return;
    }

    const body: WorkspaceTemplate = {
      name: templateName,
      manifest: this.manifestDagEditor.rawManifest
    };

    this.saveEmitted.emit(body);
  }

  onVersionSelected(version: any) {
    console.log(version);
  }
}

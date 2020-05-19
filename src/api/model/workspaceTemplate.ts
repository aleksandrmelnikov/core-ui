/**
 * Onepanel Core
 * Onepanel Core project API
 *
 * The version of the OpenAPI document: 1.0.0-beta1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { KeyValue } from './keyValue';
import { WorkflowTemplate } from './workflowTemplate';


export interface WorkspaceTemplate { 
    uid?: string;
    name?: string;
    version?: string;
    manifest?: string;
    isLatest?: boolean;
    createdAt?: string;
    workflowTemplate?: WorkflowTemplate;
    labels?: Array<KeyValue>;
    isArchived?: boolean;
}


export type DynamicsAction =
    'AddAppComponents' | 
    'AddItemCampaign' | 
    'AddItemCampaignActivity' | 
    'AddListMembersList' | 
    'AddMemberList' | 
    'AddMembersTeam' | 
    'AddPrincipalToQueue' | 
    'AddPrivilegesRole' | 
    'AddRecurrence' | 
    'AddSolutionComponent' | 
    'AddToQueue' | 
    'AddUserToRecordTeam' | 
    'ApplyRecordCreationAndUpdateRule' | 
    'ApplyRoutingRule' | 
    'AutoMapEntity' | 
    'BackgroundSendEmail' | 
    'Book' | 
    'BulkDelete' | 
    'BulkDetectDuplicates' | 
    'CalculateActualValueOpportunity' | 
    'CalculatePrice' | 
    'CanBeReferenced' | 
    'CanBeReferencing' | 
    'CancelContract' | 
    'CancelSalesOrder' | 
    'CanManyToMany' | 
    'CloneAsPatch' | 
    'CloneAsSolution' | 
    'CloneContract' | 
    'CloneMobileOfflineProfile' | 
    'CloneProduct' | 
    'CloseIncident' | 
    'CloseQuote' | 
    'CompoundUpdateDuplicateDetectionRule' | 
    'ConvertOwnerTeamToAccessTeam' | 
    'ConvertQuoteToSalesOrder' | 
    'ConvertSalesOrderToInvoice' | 
    'CopyCampaign' | 
    'CopyCampaignResponse' | 
    'CopyDynamicListToStatic' | 
    'CopyMembersList' | 
    'CopySystemForm' | 
    'CreateActivitiesList' | 
    'CreateCustomerRelationships' | 
    'CreateException' | 
    'CreateInstance' | 
    'CreateKnowledgeArticleTranslation' | 
    'CreateKnowledgeArticleVersion' | 
    'CreateWorkflowFromTemplate' | 
    'DeleteAndPromote' | 
    'DeleteAuditData' | 
    'DeleteOpenInstances' | 
    'DeleteOptionValue' | 
    'DeleteRecordChangeHistory' | 
    'DeliverIncomingEmail' | 
    'DeliverPromoteEmail' | 
    'DeprovisionLanguage' | 
    'DistributeCampaignActivity' | 
    'ExecuteWorkflow' | 
    'ExportMappingsImportMap' | 
    'ExportSolution' | 
    'ExportTranslation' | 
    'FulfillSalesOrder' | 
    'FullTextSearchKnowledgeArticle' | 
    'GenerateInvoiceFromOpportunity' | 
    'GenerateQuoteFromOpportunity' | 
    'GenerateSalesOrderFromOpportunity' | 
    'GenerateSocialProfile' | 
    'GetInvoiceProductsFromOpportunity' | 
    'GetQuoteProductsFromOpportunity' | 
    'GetSalesOrderProductsFromOpportunity' | 
    'GetTrackingTokenEmail' | 
    'GrantAccess' | 
    'ImportFieldTranslation' | 
    'ImportMappingsImportMap' | 
    'ImportRecordsImport' | 
    'ImportSolution' | 
    'ImportTranslation' | 
    'InsertOptionValue' | 
    'InsertStatusValue' | 
    'InstallSampleData' | 
    'InstantiateFilters' | 
    'InstantiateTemplate' | 
    'LockInvoicePricing' | 
    'LockSalesOrderPricing' | 
    'LoseOpportunity' | 
    'Merge' | 
    'ModifyAccess' | 
    'OrderOption' | 
    'ParseImport' | 
    'PickFromQueue' | 
    'ProcessInboundEmail' | 
    'PropagateByExpression' | 
    'ProvisionLanguage' | 
    'PublishAllXml' | 
    'PublishDuplicateRule' | 
    'PublishProductHierarchy' | 
    'PublishTheme' | 
    'PublishXml' | 
    'QualifyLead' | 
    'QualifyMemberList' | 
    'QueryExpressionToFetchXml' | 
    'ReactivateEntityKey' | 
    'ReassignObjectsOwner' | 
    'ReassignObjectsSystemUser' | 
    'Recalculate' | 
    'ReleaseToQueue' | 
    'RemoveAppComponents' | 
    'RemoveFromQueue' | 
    'RemoveItemCampaign' | 
    'RemoveItemCampaignActivity' | 
    'RemoveMemberList' | 
    'RemoveMembersTeam' | 
    'RemoveParent' | 
    'RemovePrivilegeRole' | 
    'RemoveSolutionComponent' | 
    'RemoveUserFromRecordTeam' | 
    'RenewContract' | 
    'RenewEntitlement' | 
    'ReplacePrivilegesRole' | 
    'Reschedule' | 
    'ResetUserFilters' | 
    'RevertProduct' | 
    'ReviseQuote' | 
    'RevokeAccess' | 
    'RouteTo' | 
    'SendBulkMail' | 
    'SendEmail' | 
    'SendEmailFromTemplate' | 
    'SendFax' | 
    'SendTemplate' | 
    'SetAutoNumberSeed' | 
    'SetBusinessSystemUser' | 
    'SetDataEncryptionKey' | 
    'SetFeatureStatus' | 
    'SetLocLabels' | 
    'SetParentSystemUser' | 
    'SetProcess' | 
    'SetReportRelated' | 
    'TransformImport' | 
    'TriggerServiceEndpointCheck' | 
    'UninstallSampleData' | 
    'UnlockInvoicePricing' | 
    'UnlockSalesOrderPricing' | 
    'UnpublishDuplicateRule' | 
    'UpdateFeatureConfig' | 
    'UpdateOptionValue' | 
    'UpdateProductProperties' | 
    'UpdateSolutionComponent' | 
    'UpdateStateValue' | 
    'Validate' | 
    'ValidateSavedQuery' | 
    'WinOpportunity' | 
    'WinQuote';

export const DynamicsActions = [
    'AddAppComponents',
    'AddItemCampaign',
    'AddItemCampaignActivity',
    'AddListMembersList',
    'AddMemberList',
    'AddMembersTeam',
    'AddPrincipalToQueue',
    'AddPrivilegesRole',
    'AddRecurrence',
    'AddSolutionComponent',
    'AddToQueue',
    'AddUserToRecordTeam',
    'ApplyRecordCreationAndUpdateRule',
    'ApplyRoutingRule',
    'AutoMapEntity',
    'BackgroundSendEmail',
    'Book',
    'BulkDelete',
    'BulkDetectDuplicates',
    'CalculateActualValueOpportunity',
    'CalculatePrice',
    'CanBeReferenced',
    'CanBeReferencing',
    'CancelContract',
    'CancelSalesOrder',
    'CanManyToMany',
    'CloneAsPatch',
    'CloneAsSolution',
    'CloneContract',
    'CloneMobileOfflineProfile',
    'CloneProduct',
    'CloseIncident',
    'CloseQuote',
    'CompoundUpdateDuplicateDetectionRule',
    'ConvertOwnerTeamToAccessTeam',
    'ConvertQuoteToSalesOrder',
    'ConvertSalesOrderToInvoice',
    'CopyCampaign',
    'CopyCampaignResponse',
    'CopyDynamicListToStatic',
    'CopyMembersList',
    'CopySystemForm',
    'CreateActivitiesList',
    'CreateCustomerRelationships',
    'CreateException',
    'CreateInstance',
    'CreateKnowledgeArticleTranslation',
    'CreateKnowledgeArticleVersion',
    'CreateWorkflowFromTemplate',
    'DeleteAndPromote',
    'DeleteAuditData',
    'DeleteOpenInstances',
    'DeleteOptionValue',
    'DeleteRecordChangeHistory',
    'DeliverIncomingEmail',
    'DeliverPromoteEmail',
    'DeprovisionLanguage',
    'DistributeCampaignActivity',
    'ExecuteWorkflow',
    'ExportMappingsImportMap',
    'ExportSolution',
    'ExportTranslation',
    'FulfillSalesOrder',
    'FullTextSearchKnowledgeArticle',
    'GenerateInvoiceFromOpportunity',
    'GenerateQuoteFromOpportunity',
    'GenerateSalesOrderFromOpportunity',
    'GenerateSocialProfile',
    'GetInvoiceProductsFromOpportunity',
    'GetQuoteProductsFromOpportunity',
    'GetSalesOrderProductsFromOpportunity',
    'GetTrackingTokenEmail',
    'GrantAccess',
    'ImportFieldTranslation',
    'ImportMappingsImportMap',
    'ImportRecordsImport',
    'ImportSolution',
    'ImportTranslation',
    'InsertOptionValue',
    'InsertStatusValue',
    'InstallSampleData',
    'InstantiateFilters',
    'InstantiateTemplate',
    'LockInvoicePricing',
    'LockSalesOrderPricing',
    'LoseOpportunity',
    'Merge',
    'ModifyAccess',
    'OrderOption',
    'ParseImport',
    'PickFromQueue',
    'ProcessInboundEmail',
    'PropagateByExpression',
    'ProvisionLanguage',
    'PublishAllXml',
    'PublishDuplicateRule',
    'PublishProductHierarchy',
    'PublishTheme',
    'PublishXml',
    'QualifyLead',
    'QualifyMemberList',
    'QueryExpressionToFetchXml',
    'ReactivateEntityKey',
    'ReassignObjectsOwner',
    'ReassignObjectsSystemUser',
    'Recalculate',
    'ReleaseToQueue',
    'RemoveAppComponents',
    'RemoveFromQueue',
    'RemoveItemCampaign',
    'RemoveItemCampaignActivity',
    'RemoveMemberList',
    'RemoveMembersTeam',
    'RemoveParent',
    'RemovePrivilegeRole',
    'RemoveSolutionComponent',
    'RemoveUserFromRecordTeam',
    'RenewContract',
    'RenewEntitlement',
    'ReplacePrivilegesRole',
    'Reschedule',
    'ResetUserFilters',
    'RevertProduct',
    'ReviseQuote',
    'RevokeAccess',
    'RouteTo',
    'SendBulkMail',
    'SendEmail',
    'SendEmailFromTemplate',
    'SendFax',
    'SendTemplate',
    'SetAutoNumberSeed',
    'SetBusinessSystemUser',
    'SetDataEncryptionKey',
    'SetFeatureStatus',
    'SetLocLabels',
    'SetParentSystemUser',
    'SetProcess',
    'SetReportRelated',
    'TransformImport',
    'TriggerServiceEndpointCheck',
    'UninstallSampleData',
    'UnlockInvoicePricing',
    'UnlockSalesOrderPricing',
    'UnpublishDuplicateRule',
    'UpdateFeatureConfig',
    'UpdateOptionValue',
    'UpdateProductProperties',
    'UpdateSolutionComponent',
    'UpdateStateValue',
    'Validate',
    'ValidateSavedQuery',
    'WinOpportunity',
    'WinQuote'
];

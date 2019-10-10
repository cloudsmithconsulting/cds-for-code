export type DynamicsFunction =
    'CalculateRollupField' | 
    'CalculateTotalTimeIncident' | 
    'CheckIncomingEmail' | 
    'CheckPromoteEmail' | 
    'DownloadReportDefinition' | 
    'ExpandCalendar' | 
    'ExportFieldTranslation' | 
    'FetchXmlToQueryExpression' | 
    'FindParentResourceGroup' | 
    'FormatAddress' | 
    'GetAllTimeZonesWithDisplayName' | 
    'GetDefaultPriceLevel' | 
    'GetDistinctValuesImportFile' | 
    'GetHeaderColumnsImportFile' | 
    'GetQuantityDecimal' | 
    'GetReportHistoryLimit' | 
    'GetTimeZoneCodeByLocalizedName' | 
    'GetValidManyToMany' | 
    'GetValidReferencedEntities' | 
    'GetValidReferencingEntities' | 
    'IncrementKnowledgeArticleViewCount' | 
    'InitializeFrom' | 
    'IsComponentCustomizable' | 
    'IsDataEncryptionActive' | 
    'IsValidStateTransition' | 
    'LocalTimeFromUtcTime' | 
    'QueryMultipleSchedules' | 
    'QuerySchedule' | 
    'RetrieveAbsoluteAndSiteCollectionUrl' | 
    'RetrieveActivePath' | 
    'RetrieveAllChildUsersSystemUser' | 
    'RetrieveAllEntities' | 
    'RetrieveAppComponents' | 
    'RetrieveApplicationRibbon' | 
    'RetrieveAttributeChangeHistory' | 
    'RetrieveAuditDetails' | 
    'RetrieveAuditPartitionList' | 
    'RetrieveAvailableLanguages' | 
    'RetrieveBusinessHierarchyBusinessUnit' | 
    'RetrieveByGroupResource' | 
    'RetrieveByResourceResourceGroup' | 
    'RetrieveByResourcesService' | 
    'RetrieveByTopIncidentProductKbArticle' | 
    'RetrieveByTopIncidentSubjectKbArticle' | 
    'RetrieveCurrentOrganization' | 
    'RetrieveDataEncryptionKey' | 
    'RetrieveDependenciesForDelete' | 
    'RetrieveDependenciesForUninstall' | 
    'RetrieveDependentComponents' | 
    'RetrieveDeploymentLicenseType' | 
    'RetrieveDeprovisionedLanguages' | 
    'RetrieveDuplicates' | 
    'RetrieveEntity' | 
    'RetrieveEntityRibbon' | 
    'RetrieveExchangeAppointments' | 
    'RetrieveExchangeRate' | 
    'RetrieveFilteredForms' | 
    'RetrieveFormattedImportJobResults' | 
    'RetrieveInstalledLanguagePacks' | 
    'RetrieveInstalledLanguagePackVersion' | 
    'RetrieveLicenseInfo' | 
    'RetrieveLocLabels' | 
    'RetrieveMailboxTrackingFolders' | 
    'RetrieveMembersBulkOperation' | 
    'RetrieveMetadataChanges' | 
    'RetrieveMissingComponents' | 
    'RetrieveMissingDependencies' | 
    'RetrieveOrganizationInfo' | 
    'RetrieveOrganizationResources' | 
    'RetrieveParentGroupsResourceGroup' | 
    'RetrieveParsedDataImportFile' | 
    'RetrievePersonalWall' | 
    'RetrievePrincipalAccess' | 
    'RetrievePrincipalAttributePrivileges' | 
    'RetrievePrincipalSyncAttributeMappings' | 
    'RetrievePrivilegeSet' | 
    'RetrieveProcessInstances' | 
    'RetrieveProductProperties' | 
    'RetrieveProvisionedLanguagePackVersion' | 
    'RetrieveProvisionedLanguages' | 
    'RetrieveRecordChangeHistory' | 
    'RetrieveRecordWall' | 
    'RetrieveRequiredComponents' | 
    'RetrieveRolePrivilegesRole' | 
    'RetrieveSharedPrincipalsAndAccess' | 
    'RetrieveSubGroupsResourceGroup' | 
    'RetrieveTeamPrivileges' | 
    'RetrieveTimestamp' | 
    'RetrieveTotalRecordCount' | 
    'RetrieveUnpublished' | 
    'RetrieveUnpublishedMultiple' | 
    'RetrieveUserLicenseInfo' | 
    'RetrieveUserPrivileges' | 
    'RetrieveUserQueues' | 
    'RetrieveVersion' | 
    'Rollup' | 
    'Search' | 
    'SearchByBodyKbArticle' | 
    'SearchByKeywordsKbArticle' | 
    'SearchByTitleKbArticle' | 
    'UtcTimeFromLocalTime' | 
    'ValidateApp' | 
    'ValidateRecurrenceRule' | 
    'WhoAmI';

export const DynamicsFunctions  = [
    'CalculateRollupField',
    'CalculateTotalTimeIncident',
    'CheckIncomingEmail',
    'CheckPromoteEmail',
    'DownloadReportDefinition',
    'ExpandCalendar',
    'ExportFieldTranslation',
    'FetchXmlToQueryExpression',
    'FindParentResourceGroup',
    'FormatAddress',
    'GetAllTimeZonesWithDisplayName',
    'GetDefaultPriceLevel',
    'GetDistinctValuesImportFile',
    'GetHeaderColumnsImportFile',
    'GetQuantityDecimal',
    'GetReportHistoryLimit',
    'GetTimeZoneCodeByLocalizedName',
    'GetValidManyToMany',
    'GetValidReferencedEntities',
    'GetValidReferencingEntities',
    'IncrementKnowledgeArticleViewCount',
    'InitializeFrom',
    'IsComponentCustomizable',
    'IsDataEncryptionActive',
    'IsValidStateTransition',
    'LocalTimeFromUtcTime',
    'QueryMultipleSchedules',
    'QuerySchedule',
    'RetrieveAbsoluteAndSiteCollectionUrl',
    'RetrieveActivePath',
    'RetrieveAllChildUsersSystemUser',
    'RetrieveAllEntities',
    'RetrieveAppComponents',
    'RetrieveApplicationRibbon',
    'RetrieveAttributeChangeHistory',
    'RetrieveAuditDetails',
    'RetrieveAuditPartitionList',
    'RetrieveAvailableLanguages',
    'RetrieveBusinessHierarchyBusinessUnit',
    'RetrieveByGroupResource',
    'RetrieveByResourceResourceGroup',
    'RetrieveByResourcesService',
    'RetrieveByTopIncidentProductKbArticle',
    'RetrieveByTopIncidentSubjectKbArticle',
    'RetrieveCurrentOrganization',
    'RetrieveDataEncryptionKey',
    'RetrieveDependenciesForDelete',
    'RetrieveDependenciesForUninstall',
    'RetrieveDependentComponents',
    'RetrieveDeploymentLicenseType',
    'RetrieveDeprovisionedLanguages',
    'RetrieveDuplicates',
    'RetrieveEntity',
    'RetrieveEntityRibbon',
    'RetrieveExchangeAppointments',
    'RetrieveExchangeRate',
    'RetrieveFilteredForms',
    'RetrieveFormattedImportJobResults',
    'RetrieveInstalledLanguagePacks',
    'RetrieveInstalledLanguagePackVersion',
    'RetrieveLicenseInfo',
    'RetrieveLocLabels',
    'RetrieveMailboxTrackingFolders',
    'RetrieveMembersBulkOperation',
    'RetrieveMetadataChanges',
    'RetrieveMissingComponents',
    'RetrieveMissingDependencies',
    'RetrieveOrganizationInfo',
    'RetrieveOrganizationResources',
    'RetrieveParentGroupsResourceGroup',
    'RetrieveParsedDataImportFile',
    'RetrievePersonalWall',
    'RetrievePrincipalAccess',
    'RetrievePrincipalAttributePrivileges',
    'RetrievePrincipalSyncAttributeMappings',
    'RetrievePrivilegeSet',
    'RetrieveProcessInstances',
    'RetrieveProductProperties',
    'RetrieveProvisionedLanguagePackVersion',
    'RetrieveProvisionedLanguages',
    'RetrieveRecordChangeHistory',
    'RetrieveRecordWall',
    'RetrieveRequiredComponents',
    'RetrieveRolePrivilegesRole',
    'RetrieveSharedPrincipalsAndAccess',
    'RetrieveSubGroupsResourceGroup',
    'RetrieveTeamPrivileges',
    'RetrieveTimestamp',
    'RetrieveTotalRecordCount',
    'RetrieveUnpublished',
    'RetrieveUnpublishedMultiple',
    'RetrieveUserLicenseInfo',
    'RetrieveUserPrivileges',
    'RetrieveUserQueues',
    'RetrieveVersion',
    'Rollup',
    'Search',
    'SearchByBodyKbArticle',
    'SearchByKeywordsKbArticle',
    'SearchByTitleKbArticle',
    'UtcTimeFromLocalTime',
    'ValidateApp',
    'ValidateRecurrenceRule',
    'WhoAmI'    
];

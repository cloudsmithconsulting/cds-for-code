# ![Cloudsmith Consulting LLC](https://cloudsmithstatics.azureedge.net/web/cloudsmith-notagline-450x103.png "Cloudsmith Consulting")<br> CloudSmith's Dynamics365 CrmSvcUtil Extensions
This sample is designed to help developers who are using CrmSvcUtil from the Microsoft Dynamics 365 SDK extend the code generation process.

---

## Objective
The CrmSvcUtil.exe tool provided by the Dynamics CRM SDK allows developers to customize the process of the code generation.  Out of the box, the code generation has some limitations: 

- [X] Only able to apply one custom filter or extension at a time.
- [X] No capability to filter generated entities and attributes
- [X] No capability to filter generated entities by solution.
- [X] Generated code is stressed with the publisher prefix (including undescores)
- [X] When customizing is not compatible with C# code some magic rules are applied to create names. No manual mapping is possible
- [X] No capability to break the generation up into multiple files.
- [X] Enumerations are not gnerated for OptionSets
- [ ] Not possible to inject custom base classes for Entity.
- [X] Code generation source cannot be persistet (cached) and reused during build

---

## Getting started
The CloudSmith.Dynamics365.CrmSvcUtil package contains an assembly with public types, which can bu used to inject logic into the CrmSvcUtil.exe execution pipeline.
Microsoft describes this process under [Create extensions for the code generation tool](https://msdn.microsoft.com/en-us/library/hh547384.aspx).

### Using the CloudSmith.Dynamics365.CrmSvcUtil package

1) Create the project where your generated code should be placed
1) Install and configure the Microsoft.CrmSdk.CoreTools package, which includes CrmSvcUtil.exe and it's required dependencies.

```powershell
Install-Package Microsoft.CrmSdk.CoreTools
```
3) Add the CloudSmith.Dynamics365.CrmSvcUtil package to you project:
```powershell
Install-Package CloudSmith.Dynamics365.CrmSvcUtil
```
> As a result of the installation the assembly *CloudSmith.Dynamics365.CrmSvcUtil.dll* will be copied to the `\bin\coretols` folder

> **Note:** Alternatively, you can manually deploy CloudSmith.Dynamics365.CrmSvcUtil.dll to the folder containing CrmSvcUtil.exe.

4) Inject/configure the services you want to use to modify the generated code.  
> It is possible to run each individual service extension stand-alone.  For better results, we recommend using the Composite services listed below.  The composite services are designed to run more than one underlying service and consolidate the results.

| Parameter / Key         | CrmSvcUtil Service Interface    | Extension Class                                                 | Configuration Section    |
| ----------------------- | ------------------------------- | --------------------------------------------------------------- | ------------------------ |
| codecustomization       | ICustomizeCodeDomService        | CloudSmith.Dynamics365.CrmSvcUtil.CompositeCustomizationService | Generation               |
| codewriterfilter        | ICodeWriterFilterService        | CloudSmith.Dynamics365.CrmSvcUtil.CompositeFilterService        | Filtering                |
| codewritermessagefilter | ICodeWriterMessageFilterService | CloudSmith.Dynamics365.CrmSvcUtil.CompositeFilterService        | Filtering                |
| metadataproviderservice | IMetadataProviderService        | *TBD*                                                           | *TBD*                    |
| codegenerationservice   | ICodeGenerationService          | *TBD*                                                           | *TBD*                    |
| namingservice           | INamingService                  | CloudSmith.Dynamics365.CrmSvcUtil.CompositeNamingService        | Naming                   |

You may specify these types on the CrmSvcUtil command line, or in the CrmSvcUtil.exe.config file inside the _appSettings_ element as shown below.
#### CrmSvcUtil.exe configuration
```xml
  <appSettings>
    <add key="codewriterfilter" value="CloudSmith.Dynamics365.CrmSvcUtil.CompositeFilterService, CloudSmith.Dynamics365.CrmSvcUtil" />
    <add key="codewritermessagefilter" value="CloudSmith.Dynamics365.CrmSvcUtil.CompositeFilterService, CloudSmith.Dynamics365.CrmSvcUtil" />
    <add key="codecustomization" value="CloudSmith.Dynamics365.CrmSvcUtil.CompositeCustomizationService, CloudSmith.Dynamics365.CrmSvcUtil" />
    <add key="namingservice" value="CloudSmith.Dynamics365.CrmSvcUtil.CompositeNamingService, CloudSmith.Dynamics365.CrmSvcUtil" />
  </appSettings>
```

#### Command Line syntax
```powershell
.\CrmSvcUtil.exe 
    /url:{url} 
    /username:{username} 
    /password:{password} 
    /namespace:{namespace} 
    /out:{filename} 
    /codewriterfilter:"CloudSmith.Dynamics365.CrmSvcUtil.CompositeFilterService, CloudSmith.Dynamics365.CrmSvcUtil" 
    /codewritermessagefilter:"CloudSmith.Dynamics365.CrmSvcUtil.CompositeFilterService, CloudSmith.Dynamics365.CrmSvcUtil" 
    /codecustomization:"CloudSmith.Dynamics365.CrmSvcUtil.CompositeCustomizationService, CloudSmith.Dynamics365.CrmSvcUtil" 
    /namingservice:"CloudSmith.Dynamics365.CrmSvcUtil.CompositeNamingService, CloudSmith.Dynamics365.CrmSvcUtil"
```

#### Individual services
It is possible to configure the individual services via the _appSettings_ Section in the _CrmSvcUtil.exe.config_ file, instead of using the composite services provided in the example above.  Below is a list of packaged services and the order in which rules are evaluated.
> It is not necessarily to configure the individual services in most scenarios, using the composite services above will automatically execute each individual service below.

| Order | Service                                                                         | Type                     | Purpose                                                                     |
| ----- | ------------------------------------------------------------------------------- | ------------------------ | --------------------------------------------------------------------------- |
| 0     | (default)                                                                       | ICodeWriterFilterService | CrmSvcUtil built in ICodeWriterFilterService                                |
| 1     | CloudSmith.Dynamics365.CrmSvcUtil.Filter.RegExFilterService                     | ICodeWriterFilterService | Filter entities or attributes generated via RegEx                           |
| 2     | CloudSmith.Dynamics365.CrmSvcUtil.Filter.SolutionFilterService                  | ICodeWriterFilterService | Filter entities or attributes based on their existance in a Solution        |
| 3     | CloudSmith.Dynamics365.CrmSvcUtil.Filter.ExactMatchFilterService                | ICodeWriterFilterService | Filter entities or attributes based on their match to a whitelist/blacklist |
| 4     | CloudSmith.Dynamics365.CrmSvcUtil.Filter.CustomEntitiesFilterService            | ICodeWriterFilterService | Filter customizations based on their "IsCustomized" flag in Dynamics        |
| 0     | (default)                                                                       | INamingService           | CrmSvcUtil built in INamingService                                          |
| 1     | CloudSmith.Dynamics365.CrmSvcUtil.Naming.PublisherNameService                   | INamingService           | Rename all items, optionally removing publisher prefixes                    |
| 2     | CloudSmith.Dynamics365.CrmSvcUtil.Naming.MapNameService                         | INamingService           | Rename attributes and entities, using a specific mapping scheme             |
| 0     | (default)                                                                       | ICustomizeCodeDomService | CrmSvcUtil built in ICustomizeCodeDomService                                |
| 1     | CloudSmith.Dynamics365.CrmSvcUtil.Generation.OptionSetEnumCustomizationService  | ICustomizeCodeDomService | Refactors OptionSet values to use Enum types instead of OptionSetValue      |
| 2     | CloudSmith.Dynamics365.CrmSvcUtil.Generation.ImportResolverCustomizationService | ICustomizeCodeDomService | Applies "using" or "Import" statements to each file generated               |
| 3     | CloudSmith.Dynamics365.CrmSvcUtil.Generation.FileSplitCustomizationService      | ICustomizeCodeDomService | Slices generation tasks into separate for version control                   |

5) Configure the extensions and run CrmSvcUtil.exe.

---

## How to configure CloudSmith's Dynamics 365 CrmSvcUtil extensions

The CrmSvcUtil extensions use a .NET ConfigurationSection to locate its configuration information.  All configuration values have a default value which reflects the default behavior of the CrmSvcUtil.exe tool, or can optionally disable some features.

### Adding the extension's configuration section

To start configuring the CrmSvcUtil extensions you have to add a new section in the CrmSvcUtil.exe.config file as demonstrated below.
```xml
  <configSections>
    <section name="ServiceExtensions" type="CloudSmith.Dynamics365.CrmSvcUtil.Configuration.ServiceExtensionsConfigurationSection, CloudSmith.Dynamics365.CrmSvcUtil" />
  </configSections>
```

Inside the ServiceExtensions element you may input configuration values for each individual service.  This example shows a completed configuration section that uses all the services.
```xml
  <ServiceExtensions>
    <Filtering>
      <Whitelist filter="Exclusive">
        <Entities>
          <add entity="account" />
          <add entity="contact" />
        </Entities>
        <Attributes>
          <add entity="*" attribute="name" />
        </Attributes>
        <OptionSets>
          <add entity="*" optionSet="addresstype" />
        </OptionSets>
        <Filters>
          <entity expression=".*" ignoreCase="true" />
          <attribute entity="*" expression=".*" ignoreCase="true" />
        </Filters>        
        <Solutions>
          <add solution="MyDynamicsSolution" />
        </Solutions>
        <!-- Valid values are Default, CustomOnly, and UncustomizedOnly -->
        <Customizations strategy="Default" />
      </Whitelist>
      <Blacklist>
        <Entities>
          <!-- wont be blacklisted as it's on the whitelist -->
          <add entity="contact" />
        </Entities>
        <Attributes>
          <add entity="*" attribute="description" />
        </Attributes>
      </Blacklist>
    </Filtering>
    <Naming>
      <!-- configuration that goes here only applies for the NamingService -->
      <PublisherRules>
        <add name="cs_" action="remove" />
      </PublisherRules>
      <MappingRules>
        <add from="sample_entity" to="MyEntity" type="entity"/>
        <add from="sample_entity.foo" to="Bar" type="attribute"/>
      </MappingRules>
    </Naming>
    <CodeGeneration path=".\Output">
      <Behaviors>
        <add name="TranslateOptionSetsAsEnums" />
        <add name="ImportNamespaces" arguments="System,System.ComponentModel,System.Runtime.Serialization,System.CodeDom.Compiler,Microsoft.Xrm.Sdk" />
      </Behaviors>
      <Files>
        <!-- options for type include: Entities, AttributeConstants, OptionSets, Requests -->
        <!-- options for generate include: OneFilePerEntity, OneFilePerItem, SingleFile -->
        <!-- format string is only 1 parameter: (name; formatted as filename safe) -->
        <!-- paths are relative to the code generation path above, or output switch, or current folder -->
        <add filename="Entities\{0}.cs" type="Entities" generate="OneFilePerEntity" />
        <add filename="Entities\{0}.attributes.cs" type="AttributeConstants" generate="OneFilePerEntity" />
        <add filename="Entities\{0}.optionsets.cs" type="OptionSets" generate="OneFilePerEntity" />
        <add filename="Requests.cs" type="Requests" generate="SingleFile" />
      </Files>
    </CodeGeneration>
  </ServiceExtensions>
```

### _Filtering_ element
The _Filtering_ element allows you to configure the beavior of the filtering services using a Whitelist and a Blacklist.

* Whitelist items are first processed, and when a match is made on the Whitelist the item will be generated, even if it is later blacklisted.
* Blacklist items are processed second.  An item that is blacklisted is removed from entity generation.

#### Whitelisting

Whitelisting has 2 modes - Inclusive and Exclusive.

* Exclusive whitelisting will generate **only** items that are on the whitelist, ignoring all others.  
* Inclusive whitelisting will ensrue items on the whitelist are generated, and will generate anything else not blacklisted.

#### Collection Elements
The _Entities_, _Attributes_, _OptionSets_ and _Solutions_ elements inside the _Filtering_ element are collection elements.  Collection
elements can be layered in many configuration files, allowing a composite set of items to be procesed from different configurations.  The
elements (tags) that can go inside collections include:

| Element              | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| add                  | Adds an element to the collection.  Each item is keyed                          |
| clear                | Clears the contents of the collection, regardless of how it was populated.      |
| remove               | Removes an element from the collection.                                         |

#### _Entities_ element
The _Entities_ element allows you to configure specific entiites for whitelisting or blacklisting.  They are specified using these configuration attributes:

| Attribute            | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| entity               | The logical name of the entity (e.g. account)                                   |

The following example shows how to add an entity to a WhiteList in configuration:

```xml
<Whitelist filter="Exclusive">
  <Entities>
    <add entity="account" />
  </Entities>
</Whitelist>
```

#### _Attributes_ element
The _Attributes_ element allows you to configure specific attributes (per entity or globally) for whitelisting or blacklisting.  They are specified using these configuration attributes:

| Attribute            | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| entity               | The logical name of the entity (use "*" to specify all entities)                |
| attribute            | The logical name of the attribute (e.g. description)                            |

The following example shows how to add the attribute "name" to a WhiteList for all entities in configuration:

```xml
<Whitelist filter="Exclusive">
  <Attributes>
    <add entity="*" attribute="name" />
  </Attributes>
</Whitelist>
```

#### _OptionSet_ element
The _OptionSets_ element allows you to configure specific option sets (per entity or globally) for whitelisting or blacklisting.  They are specified using these configuration attributes:

| Attribute            | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| entity               | The logical name of the entity for local option sets, (omit for global sets)    |
| optionSet            | The logical name of the option set (e.g. description)                           |

The following example shows how to add the attribute "name" to a WhiteList for all entities in configuration:

```xml
<Whitelist filter="Exclusive">
  <OptionSets>
    <add entity="*" optionSet="addresstype" />
  </OptionSets>
</Whitelist>
```

#### _Filters_ element
The _Filters_ element allows you to add custom filters for entities, attributes or OptionSets by using regular expressions.
> By default the _Filters_ element contains the _expression_ "`.*`", which means that all items are part of the output.

The _Filters_ element works differently than other configuration sets.  You add filters cumulatively using specified element names.  The following elements are supported:

| Element              | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| entity               | Defines a regular expression to use against an entity's logical name            |
| attribute            | Defines a regular expression to use against an attribute's logical name         |
| optionSet            | Defines a regular expression to use against an option set's logical name        |

The following attributes apply to each element.

##### _entity_ elements

| Attribute            | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| expression           | The regular expression to match against                                         |
| ignoreCase           | true/false value indicating if case-sensitivity should be ignored               |

##### _attribute_ elements

| Attribute            | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| entity               | Defines which entiy to use when matching.  Use "*" for all                      |
| expression           | The regular expression to match against                                         |
| ignoreCase           | true/false value indicating if case-sensitivity should be ignored               |

##### _optionSet_ elements

| Attribute            | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| expression           | The regular expression to match against                                         |
| ignoreCase           | true/false value indicating if case-sensitivity should be ignored               |

Here is an example of regular expression filters applied to entities and attributes.

```xml
<Whitelist filter="Exclusive">
  <Filters>
    <entity expression=".*" ignoreCase="true" />
    <attribute entity="*" expression=".*" ignoreCase="true" />
  </Filters>        
</Whitelist>
```

#### _Solutions_ element
The _Solutions_ element allows you to configure which entities and attributes should be part of the generated code based on their inclusion in one or more solutions.  Items will be included or excluded based on their presence in a solution.  Here is an example of the _Solutions_ element in a whitelist.

```xml
<Whitelist filter="Exclusive">
  <Solutions>
    <!-- configuration that goes here only applies for the SolutionFilterService -->
    <add solution="MyDynamicsSolution" />
  </Solutions>
</Whitelist>
```

### _Customization_ element
The _Customization_ element allows you to influence if you would like custom entities included or not.  It is a single element with just one attribute, _strategy_.

The following values are defined for the "strategy" attribute.

| Attribute value      | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| Default              | Allows both customized and non-customized items to be generated                 |  
| CustomOnly           | Generates only custom items.  All out of the box items are skipped              |
| UncustomizedOnly     | Generates only uncustomized items.  All non out of the box items are skipped    |

Below is an example of using this filter in a whitelist.

```xml
<Whitelist filter="Exclusive">
  <!-- Valid values are Default, CustomOnly, and UncustomizedOnly -->
  <Customizations strategy="Default" />
</Whitelist>
```

### Naming Rules
Naming rules allow you to change the behavior of how items are named when they are generated.  The following naming rules are available.

| Rule                 | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| PublisherRules       | Rules that can remove publisher prefixes from generated items                   |
| MappingRules         | Rules that can map types to alternative names                                   |

#### PublisherRules element
The _PublisherRules_ element configures how publisher prefixed names shoudld be handled.

* The _name_ attribute identifies the *CRM Publisher* prefix
* The _action_ attribute determines the translation of the prefix

| Action | Description                             |
| ------ | --------------------------------------- |
| Remove | Removes the prefix from the Member Name |

```xml
<Naming>
  <PublisherRules>
    <!-- remove the beedev_ prefix from the entities -->
    <add name="cs_" action="Remove"/>
  </PublisherRules>
</Naming>
```

The above configuration reults in the following code:

```csharp
/// <summary>
/// 
/// </summary>
[System.Runtime.Serialization.DataContractAttribute()]
[Microsoft.Xrm.Sdk.Client.EntityLogicalNameAttribute("cs_sampleentity")]
[System.CodeDom.Compiler.GeneratedCodeAttribute("CrmSvcUtil", "8.2.1.8676")]
public partial class SampleEntity : Microsoft.Xrm.Sdk.Entity, System.ComponentModel.INotifyPropertyChanging, System.ComponentModel.INotifyPropertyChanged
{
  
  /// <summary>
  /// Default Constructor.
  /// </summary>
  public SampleEntity() : 
      base(EntityLogicalName)
  {
  }
  
  public const string EntityLogicalName = "cs_sampleentity";

  // ...


  /// <summary>
  /// The name of the custom entity.
  /// </summary>
  [Microsoft.Xrm.Sdk.AttributeLogicalNameAttribute("cs_name")]
  public string Name
  {
    get
    {
      return this.GetAttributeValue<string>("cs_name");
    }
    set
    {
      this.OnPropertyChanging("Name");
      this.SetAttributeValue("cs_name", value);
      this.OnPropertyChanged("Name");
    }
  }
}
``` 

#### MappingRules

The _MappingRules_ section allows a detailed control for the naming of special CRM Element like Entities or Attributes.

* the _from_ attribute represents the LogicalName of the element.  To identify attributes in an entity, use _._ as a separator.  (ex: &lt;EntityLogicalName&gt;.&lt;AttributeLogicalName&gt;)
* the _to_ attribute is the name you want to see in code.
* the _type_ attribute determines what type of element the rule applies to.


```xml
<Naming>
  <MappingRules>
    <add from="sample_entity" to="MyEntity" type="entity"/>
    <add from="sample_entity.foo" to="Bar" type="attribute"/>
  </MappingRules>
</Naming>
```

---

### CodeGeneration Options
It is possible to influence how the actual output files are generated in CrmSvcUtil.exe using options in the _Generation_ element.  The _Generation_ element can be configured in these ways:

| Name                 | Purpose                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| outputPath           | The root path to use when generating files.                                     |
| language             | The language to use when generating files.                                      |
| Behaviors            | A collection of behaviors to enable when generating files.                      |
| Files                | A collection of output files and strategies for outputting each item            |

#### _outputPath_ attribute
The outputPath attribute can remain empty (or missing), a relative path, or an absolute path.  The following table lists the expected outcome of each value.

| Value                | Outcome                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| empty                | The current working directory where CrmSvcUtil.exe is executed will be used.    |
| relative path        | The relative path will be resolved from the current working directory           |
| absolute path        | The absolute path will be resolved as provided                                  |

#### _language_ attribute
The language attribute can remain empty (and will assume C# of whatever commandline variable was supplied), or contain one of these supported output types.

| Value                | Outcome                                                                         |
| -------------------- | ------------------------------------------------------------------------------- |
| empty                | The "language" argument will be used, otherwise CSharp                          |
| CSharp               | All types will be generated in Microsoft C#                                     |
| VisualBasic          | All types will be generated in Microsoft Visual Basic                           |

#### _Behaviors_ element
The behaviors element allows you to inject certain behaviors into the code generation process.  The following is a list of behaviors that currently ship with these extensions.

| Behavior                     | Arguments                                | Outcome                                                                         |
| ---------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------- |
| TranslateOptionSetsAsEnums   | (none)                                   | Turns option set int values into Enums automatically.                           |
| ImportNamespaces             | comma delimited list of using statements | Adds and resolves namespaces automatically to the top of each generated file.   |

The following example shows how to setup code generation with additional behaviors enabled.

```xml
<CodeGeneration path=".\Output" language="CSharp">
  <Behaviors>
    <add name="TranslateOptionSetsAsEnums" />
    <add name="ImportNamespaces" arguments="System,System.ComponentModel,System.Runtime.Serialization,System.CodeDom.Compiler,Microsoft.Xrm.Sdk" />
  </Behaviors>
</CodeGeneration>
```

#### _Files_ element
You may generate up to 6 sets of files using the Files collection.  Each type of file hsa various strategies available for generation.

| Type                 | File contains                                                                   | Applicable Strategies                        |
| -------------------- | ------------------------------------------------------------------------------- | -------------------------------------------- |
| Entities             | Entity class defiinitions                                                       | OneFilePerType, OneFilePerItem, SingleFile   |
| OptionSets           | Enum definitions for local option sets                                          | OneFilePerType, OneFilePerItem, SingleFile   |
| Attributes           | Static field (const) definitions for attribute names                            | OneFilePerType, SingleFile                   |
| Requests             | Class definitions for requests and requests generated from SDK message pairs    | OneFilePerType, SingleFile                   |
| Responses            | Class definitions for responses                                                 | OneFilePerType, SingleFile                   |
| ServiceContext       | Class definition for the Service Context                                        | SingleFile                                   |

The following example shows how to setup code generation with unique files for each entity, but otherwise single files per type.

```xml
<CodeGeneration path=".\Output" language="CSharp">
  <Files>
    <!-- options for type include: Entities, AttributeConstants, OptionSets, Requests, Responses, ServiceContext -->
    <!-- options for generate include: OneFilePerItem, OneFilePerType, SingleFile -->
    <!-- format string is up to 3 parameters: (root filename (no suffix); type; name; formatted as filename safe) -->
    <!-- paths are relative to the code generation path above, or output switch, or current folder -->
    <add filename="{0}.{1}.{2}.cs" type="Entities" generate="OneFilePerItem" />
    <add filename="{0}.{1}.cs" type="AttributeConstants" generate="OneFilePerType" />
    <add filename="{0}.{1}.cs" type="OptionSets" generate="OneFilePerType" />
    <add filename="{0}.{1}.cs" type="Requests" generate="OneFilePerType" />
  </Files>
</CodeGeneration>
```

---

## References

This work is largely derivitive.  CloudSmith would like to recognize and thank the contributors and underlying projects that represent this extension's foundation.

| Project                                                                     | Author                                              | License      |
| --------------------------------------------------------------------------- | --------------------------------------------------- | ------------ |
| [NZ.CrmSvcUtil](https://github.com/SBSTNZ/NZ.CrmSvcUtil)                    | [Peter Geil](https://github.com/SBSTNZ)             | None         |
| [CRMSvcUtilExtensions](https://github.com/bassetassen/crmsvcutilextensions) | [Sebastian Holager](https://github.com/bassetassen) | MIT          |
| [Xrm.Tooling](https://github.com/JJauss/Xrm.Tooling)                        | [Joachim Jauß](https://github.com/JJauss)           | None         |
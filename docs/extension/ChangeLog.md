# Change Log

All notable changes to the "cds-for-code" extension will be documented in this file.

---

## v0.9 Public Preview - January 2020
**We expect the first 0.9 build to drop to GitHub on or before January 27, 2020.**  Check back soon for release notes.

---

## v0.8 Early Preview - December 2019 - January 2020

### v0.8.8 (January 23, 2020)
- Feature: DevOps - Add built in template sources to solution/deployment ([#395](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/395/))
- Feature: Docs - How to manage solution assets ([#407](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/407/))
- Feature: Docs - How to create/manage web resources ([#408](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/408/))
- Feature: Docs - How to create/manage plugins ([#409](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/409/))
- Feature: Docs - How to Generate Entity Code ([#411](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/411/))
- Feature: DevOps - automatic promotion to GitHub for build completion/integration ([#446](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/446/))
- Feature: Beta - customize entity generation UX is complete for "pass 1" ([#508](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/508/))
- Feature: Multiple usability enhancements in the "Add new Connection" screen ([#539](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/539/))
- Feature: Add "Apps" support to CDS explorer view ([#540](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/540/))
- Feature: Loading indicator updated on plugin step screen ([#557](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/557/))
- Feature: Refactor icon/script download calls to use new deployment mechanism/download logic ([#335](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/335/))
- Bugfix: Naming webresources without the correct prefix fails on solution import ([#384](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/384/))
- Bugfix: Save button for connection sometimes not visible ([#521](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/521/))
- Bugfix: Regression - OnPrem connections do not obtain AppUri correctly ([#543](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/543/))
- Bugfix: Security - Certain conditions may cause a password to be exposed in terminal ([#547](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/547/))
- Bugfix: New web resource deployments to CDS outside solution packing can error ([#549](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/549/))
- Bugfix: New plugin image steps do not save under certain conditions ([#550](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/550/))
- Bugfix: On-prem connections do not always expand after clicking refresh in CDS Explorer ([#551](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/551/))
- Bugfix: Plugins show "vundefined" in CDS Explorer ([#552](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/552/))
- Bugfix: Generate entities command can fail with online users using MFA ([#558](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/558/))

### v0.8.7 (January 13, 2020)
- Feature: Icons now match color from VS code theme more accurately ([#336](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/336/))
- Feature: Telemetry and performance stats are optimizsed and evaluated for treeview loads ([#522](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/522/))
- Feature: TreeView entries only query CDS API for minimum required attributes ([#524](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/524/))
- Feature: Performance telemetry and throttle limits are kept for CDS API calls ([#525](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/525/))
- Feature: "Show Default Solution" is disabled by default and no longer shows "Default Solution" in solutions menu when eneabled ([#526](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/526/))
- Feature: Aborted requests now report back to the end user ([#527](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/527/))
- Feature: Performance of TreeView node parsing has improved dramatically ([#534](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/534/))
- Bugfix: Unable to save a new process when selecting workflow/action ([#372](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/372/))
- Bugfix: CDS Explorer: Calls are sometimes long or don't return ([#398](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/398/))
- Bugfix: CDS Explorer: Errors returned when clicking "+" next to Processes inside a Solution ([#444](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/444/))
- Bugfix: CDS Explorer: Cannot add a new connection under certain conditions ([#514](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/514/))
- Bugfix: CDS Explorer: Error when you click the Refresh button under certain conditions ([#515](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/515/))
- Bugfix: CDS Explorer: Plugins do not load correctly ([#519](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/519/))
- Bugfix: CDS Explorer: Web Resources load slowly and do not always recurse correctly ([#528](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/528/))
- Bugfix: CDS Explorer: Processes do not expand under a solution ([#535](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/535/))
- Bugfix: CDS Explorer: Plugin steps do not expand in the explorer view ([#536](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/536/))
- Bugfix: Localized labels are obtained in ordinal fashion instead of user preference ([#532](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/532/))
- Refactor: Treeviews are now single classes with single responsibility leveraging new command model ([#332](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/332))

### v0.8.6 (January 6, 2020)

- Feature: CloudSmith CDS for Code Output window added ([#258](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/258/), [#259](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/259/), [#379](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/378/))
- Feature: Commands and view initializers output to Output Window ([#261](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/259/))
- Feature: Plugin step registration view uses new Materialize view format ([#416](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/416/))
- Feature: Plugin step image registration view uses new Materialize view format ([#517](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/517/))
- Feature: With user consent, telemetry is now tracked using AppInsights ([#449](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/449/), [#450](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/450/), [#451](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/451/))
- Bugfix: MFA doesn't work on domains outside CloudSmith Azure AD instance ([#518](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/518/))
- Bugfix: Opening connection editor and attempting re-save without any changes fails
- Refactor: Removed "Dynamics" monicker from most internal classes

### v0.8.5 (December 26, 2019)

- Feature: Create UrlResolver for PowerApps modern maker UX ([#392](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/392/))
- Bugfix: Online connection loses its access in 1 hr ([#445](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/445/))
- Bugfix: Connecting: Account does not exist in CloudSmith tenant ([#441](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/441/))

### v0.8.4 (December 16, 2019)

- Feature: Security - Edit credentials should never allow debugger to see passwords ([#430](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/430/))
- Feature: Connections - Implement MFA support using Express ([#391](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/391/))
- Feature: Connections - Implement login to Azure AD ([#360](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/360/))
- Bugfix: There were errors retreiving organizations from 'Home': request timed out ([#426]((https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/426/)))
- Bugfix: Item and Project template treeview does not refresh ([#349](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/349/))
- Bugfix: Plugin step/Step image - is not assigned to the solution ([#389](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/389/))
- Bugfix: Passwords containing $ prevent unpacking (possibly more) ([#428](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/428/))
- Bugfix: Connection dialog does not handle improper online connections ([#415](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/415/))
- Bugfix: Templates seem to be imported on every launch ([#396](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/396/))

### v0.8.3 (December 13, 2019)

- Bugfix: New webresource not displayed into dynamics ([#385](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/385/))
- Bugfix: Error showed up claiming "Cannot read property for 'forEach' of undefined." ([#414](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/414/))

### v0.8.2 (December 11, 2019)

- Bugfix: Cannot expand solution view when workspace is not loaded ([#390](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/390/))

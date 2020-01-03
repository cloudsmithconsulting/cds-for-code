# Change Log

All notable changes to the "cds-for-code" extension will be documented in this file.

## v0.8.6 (January 6, 2020)

- Feature: CloudSmith CDS for Code Output window added ([#258](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/258/), [#259](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/259/), [#379](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/378/))
- Feature: Commands and view initializers output to Output Window ([#261](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/259/))
- Feature: Plugin step registration view uses new Materialize view format ([#416](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/416/))
- Feature: Plugin step image registration view uses new Materialize view format ([#517](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/517/))
- Feature: With user consent, telemetry is now tracked using AppInsights ([#449](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/449/), [#450](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/450/), [#451](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/451/))
- Bugfix: MFA doesn't work on domains outside CloudSmith Azure AD instance ([#518](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/518/))
- Bugfix: Opening connection editor and attempting re-save without any changes fails
- Refactor: Removed "Dynamics" monicker from most internal classes

## v0.8.5 (December 26, 2019)

- Feature: Create UrlResolver for PowerApps modern maker UX ([#392](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/392/))
- Bugfix: Online connection loses its access in 1 hr ([#445](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/445/))
- Bugfix: Connecting: Account does not exist in CloudSmith tenant ([#441](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/441/))

## v0.8.4 (December 16, 2019)

- Feature: Security - Edit credentials should never allow debugger to see passwords ([#430](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/430/))
- Feature: Connections - Implement MFA support using Express ([#391](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/391/))
- Feature: Connections - Implement login to Azure AD ([#360](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/360/))
- Bugfix: There were errors retreiving organizations from 'Home': request timed out ([#426]((https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/426/)))
- Bugfix: Item and Project template treeview does not refresh ([#349](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/349/))
- Bugfix: Plugin step/Step image - is not assigned to the solution ([#389](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/389/))
- Bugfix: Passwords containing $ prevent unpacking (possibly more) ([#428](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/428/))
- Bugfix: Connection dialog does not handle improper online connections ([#415](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/415/))
- Bugfix: Templates seem to be imported on every launch ([#396](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/396/))

## v0.8.3 (December 13, 2019)

- Bugfix: New webresource not displayed into dynamics ([#385](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/385/))
- Bugfix: Error showed up claiming "Cannot read property for 'forEach' of undefined." ([#414](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/414/))

## v0.8.2 (December 11, 2019)

- Bugfix: Cannot expand solution view when workspace is not loaded ([#390](https://dev.azure.com/cloudsmith-consulting/CloudSmith/_workitems/edit/390/))

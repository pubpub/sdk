# pubpub-client

## 1.1.1

### Patch Changes

- Fix `communities.getCommunities` not working

## 1.1.0

### Minor Changes

- Add ability to authenticate using authorization tokens instead of username/password
- Update changed types

## 1.0.1

### Patch Changes

- 726f510: Initial Release

## 1.0.2

### Patch Changes

- Improve types for facets and certain CRUD operations, make `pubpub.pub.text.importToPub` work

## 0.9.0

### Minor Changes

- 7ea7d22: Use pubpub core to make client

## 0.8.2

### Patch Changes

- Actually fix the node16 issue

## 0.8.1

### Patch Changes

- Add .cts files so moduleResolution: node16/nodenext works in typescript

## 0.8.0

### Minor Changes

- Switch to using native fetch and formdata, add better types

## 0.7.0

### Minor Changes

- Fix crucial authentication issues

## 0.6.0

### Minor Changes

- Add ability to import multiple main document. Add ability to do manual postprocessing of prosemirror tree before importing.

## 0.5.0

### Minor Changes

- Change firebase dependency and improve how exporting works

## 0.4.0

### Minor Changes

- Correctly import files for both ESM and CJS

## 0.3.2

### Patch Changes

- Make API more consistent wrt requiring ids

## 0.3.1

### Patch Changes

- Fix issue with facets

## 0.3.0

### Minor Changes

- Change some methods to private as to avoid abuse, make client Node only due to CORS issues, and make managing uploads easier.

## 0.2.0

### Minor Changes

- Add the ability to import and export pubs

# Curious Admin

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
<!-- [![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors-) -->
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- [![Build Status][build-badge]][build] [![MIT License][license-badge]][license] -->

<!-- prettier-ignore-start -->

<!-- [build-badge]: https://img.shields.io/github/workflow/status/zainfathoni/curious-admin/CI?logo=github&style=flat-square
[build]: https://github.com/insvire/curious-admin/actions?query=workflow%3ACI
[license-badge]: https://img.shields.io/badge/license-MIT-blue?style=flat-square -->
[license]: LICENSE

<!-- prettier-ignore-end -->

The source code of Curious Admin website.

- [Curious Admin](#curious-admin)
  - [Documentation](#documentation)
  - [Getting started](#getting-started)
    - [System Requirements](#system-requirements)
    - [Development](#development)
    - [Testing](#testing)
  - [Tools & References](#tools--references)
    - [Tools](#tools)
      - [Code Editor](#code-editor)
    - [References](#references)
  - [Contributing](#contributing)

## Documentation

- [Main Docs](docs/index.md)

## Getting started

### System Requirements

- [Node.js](https://nodejs.org/) >= 16.0.0
- [git](https://git-scm.com/) >= 2.7.0

### Development

To get started running the project locally, please follow the steps below.

First, clone the repository.

```sh
git clone https://github.com/insvire/curious-admin.git
```

or if you're cloning using SSH.

```sh
git clone git@github.com:insvire/curious-admin.git
```

Then go to the directory and copy the example environment variables into an
ignored `.env` file

```sh
cd curious-admin
cp .env.example .env
```

Run this command to perform the initial setup while making sure that the app can
run properly in your local.

```sh
yarn install
```

Finally, run the development server to start developing.

```sh
yarn start
```

Open <http://localhost:3000> with your browser to see the result. This starts
your app in development mode, rebuilding assets on file changes.

### Testing

Run this command to start the end-to-end testing locally.

```sh
yarn test:e2e:run
```

## Tools & References

### Tools

- [Commitlint.io](https://commitlint.io)
- [Testing Playground](https://testing-playground.com/)

#### Code Editor

If you're using Visual Studio Code, you can install the recommended extensions
for this project by
[using `@recommended` filter](https://code.visualstudio.com/docs/editor/extension-marketplace#_extensions-view-filters).

![Recommended VS Code Extensions](https://user-images.githubusercontent.com/6315466/147128206-3b1acdaa-213f-4e2b-a0a3-4b8c63bc881d.png)

### References

- [React Docs](https://reactjs.org/docs/getting-started.html/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Apollo Client](https://www.apollographql.com/docs/react/)
- [Firebase](https://firebase.google.com/docs/reference/js/)

## Contributing

See our contribution guidelines in these languages:

- [English](CONTRIBUTING.md)
- [Indonesian](CONTRIBUTING_ID.md)

When contributing to our project, please use English when communicating with
other people in issues and/or pull requests.
[Click here](CONTRIBUTING.md#why-are-we-using-english-in-our-issues--prs) to
read why.
([Bahasa Indonesia](CONTRIBUTING_ID.md#mengapa-kita-menggunakan-bahasa-inggris-dalam-menulis-issue-dan-pull-request))

<!-- ### Important links -->

<!-- markdownlint-disable line-length -->

<!-- | Description                  | Link                                                       |
| ---------------------------- | ---------------------------------------------------------- |
| Project overview             | [rbagi.id/github-project](https://rbagi.id/github-project) |
| Epics list                   | [rbagi.id/epic](https://rbagi.id/epic)                     |
| Issues board                 | [rbagi.id/board](https://rbagi.id/board)                   |
| Issue shortlink              | [rbagi.id/gh/:issue-id](https://rbagi.id/gh)               |
| First-time contributors link | [rbagi.id/contribute](https://rbagi.id/contribute)         | -->

<!-- markdownlint-restore -->

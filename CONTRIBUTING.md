# Contributing to Codistica React Forms

Thank you for contributing to Codistica React Forms.

Before starting, be sure you have installed:

-   [Node][node-url]
-   [Yarn][yarn-url]
-   [Git][git-url]

## Code Formatting

In order to guarantee harmony to the repository,
any modification should follow the rules stated in this file
and be compliant with current code quality tools configuration.

## Type Checking

We write our code in [TypeScript][typescript-url] to increase
its soundness.

## Comments

Add as many comments as needed so others understand what is going on.
Comments should be in capital letters and be placed close to where they are referring.

**Example:**

```ts
// PRINTING NUMBERS 1 UP TO 3
[1, 2, 3].forEach((n: number): void => {
    console.log(n);
});
```

## Modularity

If you think any new or existing code can be reused,
it would be better to add it as a new standalone module. Try to split your
logic as much as possible, gradually increasing abstraction to maximise reuse.

## Testing

Every modification to the code should have a corresponding testing adaptation.

### Running Tests Locally

Running tests is important to catch any unexpected behavior.

```bash
yarn run test
```

### Tests Locations

Tests are located just beside the source file, respecting the following naming convention: `name-of-source-file.test.ts`.

### Adding/Modifying/Removing Tests

Every module should have a test that runs every single line of the interested code, so be sure
any addition/modification/removal of code meets this requirement (100% coverage is a mandatory requirement).

## Commits

In order to keep an organized workflow, be sure to split any modification onto separate commits.
Commits should have the following syntax:

```bash
git commit -m "<TASK>: <DESCRIPTION>"
```

Allowed tasks are:

-   **feat** - Implementation of a new feature.
-   **chore** - Generally codebase maintenance.
-   **docs** - Documentation related commits.
-   **fix** - Bug and other code fixes.
-   **tests** - Addition/modification of tests.
-   **refactor** - File renaming.
-   **perf** - Performance improvement without functional modifications.
-   **ci** - Reserved for CI/CD pipelines tasks.

_(**NOTE:** A [GIT Hook][git-hooks-url] handlers will run to validate every commit message, be sure you do not skip them.)_

## Changelogs

On the [changelog file][changelog],
add your contribution under the
`unreleased` title (and under the section(s) that better matches your contribution).

Sections can be:

-   **Added**
-   **Changed**
-   **Removed**
-   **Fixed**

Your contribution may look like this:

```md
### Added

-   Brief description (#<work item number>, @<your GitHub username>).
```

_(**NOTE:** if you prefer, you can keep your username anonymous, just write
"Anonymous" instead of your GitHub username)_

Then, at the bottom of the changelog file, under the 'CONTRIBUTORS' section,
link your username to your GitHub profile link:

```md
<!--CONTRIBUTORS-->

[@<your GitHub username>]: <your GitHub profile url>
```

Finally, link the work item number to the actual work item that originated your pull
request under the 'WORK ITEMS' section:

```md
<!--WORK ITEMS-->

[#<work item number>]: <work item url>
```

_(**NOTE:** If your contribution has no related work item, you can skip this part)_

### Pull Requests

Once the hard job is done, it's the moment for a [pull request][pull-request-url].
This is the way to implement your changes to the codebase, so they will be published in
the next release.

[Create a new pull request][codistica-pr-url] from `your-branch` to `development`.
Fill the template and submit the pull request for review.

#### Thank you for making Codistica React Forms better for everyone!

[changelog]: ./CHANGELOG.MD
[node-url]: https://nodejs.org
[yarn-url]: https://yarnpkg.com
[git-url]: https://git-scm.com
[typescript-url]: https://www.typescriptlang.org
[git-hooks-url]: https://git-scm.com/docs/githooks
[pull-request-url]: https://docs.github.com/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests
[codistica-pr-url]: https://github.com/codistica/codistica-react-forms/pulls

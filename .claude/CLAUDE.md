# Project Notes

## Coding Standards

- KISS: Keep every function and module as simple as possible. If it feels clever, simplify it.
- DRY: Never duplicate logic. Extract shared code into a single, well-named function.
- Flat over nested: Avoid deep nesting. Use early returns and guard clauses instead of nested if/else chains.
- Clear naming: Variables, functions, and files should read like plain English. No abbreviations unless universally understood (e.g., df, idx).
- Short functions: Each function should do one thing. If it needs a comment to explain what a block does, that block should be its own function.
- No magic numbers: Use named constants for thresholds, defaults, and configuration values.
- Minimal abstraction: Don't create classes, wrappers, or layers unless they eliminate real duplication. A plain function is almost always enough.
- Readable flow: Code should read top-to-bottom like a narrative. Structure scripts as: imports, constants, helper functions, main logic.
- Delete dead code: No commented-out blocks, unused imports, or vestigial functions. If it's not called, remove it.
- Explicit over implicit: Pass values as arguments rather than relying on globals or side effects. Make data flow obvious.

## Unit tests

Mindset:
- Create unit test, user story tests, and integration tests
- Check for fake tests and remove them.
- Try to make the unit tests more KISS.
- Try to make the unit tests more DRY.
- Test one behavior per test. If you need "and" in the name, split it.
- Don't repeat already tested behavior : reduce tests line count.
- Arrange-Act-Assert, nothing more - 3-5 lines max. If setup is complex, your code needs refactoring, not your test.
- Use literals over variables - assert result == 42 beats assert result == EXPECTED_VALUE. Indirection hides intent.
- Skip mocks when possible - Real objects with simple inputs are easier to maintain. Mock only external I/O (network, disk, time).
- Prefer inlined small data rather than big fixtures defined far from the test
- Test the contract, not the implementation - If refactoring internals breaks tests, they're testing the wrong thing. Focus on inputs → outputs.

Anti-patterns to avoid:
- Parametrizing when 2 explicit tests would be clearer
- Helper functions that hide what's being tested
- Comments explaining what the test does (the name should say it)
- Have too computation in the test. Just write easily readable results

## Documentation

Documentation is a living artifact. It grows as the project grows and must stay searchable, fragmented, and up to date.

### Structure

There are two kinds of documentation:

1. File-level docs — Any file my_file.py (or .zip, .csv, .json, etc.) can have a companion my_file.doc.md in the same directory. This documents that specific file: what it does, its inputs/outputs, gotchas, data format, design decisions.

2. Project knowledge — General knowledge lives in knowledge/. Each topic gets its own .md file with a descriptive, keyword-rich name (e.g., knowledge/api-authentication.md, knowledge/deployment-process.md). Use subdirectories when a topic is broad enough to need multiple files (e.g., knowledge/data-sources/).

### Rules

- One page max per file. If a doc file grows beyond roughly one page, split it into a directory of smaller files or subdirectories. Short files are easier to find and maintain.
- Descriptive file names. Use plain English with hyphens. Names should contain the keywords someone would search for (e.g., error-handling-strategy.md, not notes3.md).
- Header required. Every doc file starts with a # title that summarizes the file's purpose in one line.
- Searchable language. Write with intuitive words and domain terms. Avoid abbreviations or internal jargon that wouldn't match a search query.
- Fragmented by topic. Never dump multiple unrelated topics into one file. One file = one topic.

### When to write and update docs

- During research. When exploring data, APIs, libraries, or code — write down what you learned immediately. Create or update the relevant knowledge/ file or the companion .doc.md.
- After modifying a file. If working on a file changes its behavior, interface, or assumptions, update the companion .doc.md before finishing. If the doc doesn't exist yet, create it.
- After reading a file. If you read a file and gain understanding that isn't documented, capture it in the companion .doc.md.
- When discovering something non-obvious. Edge cases, workarounds, external API quirks, data quality issues — anything that cost time to figure out goes into a doc file so it's never re-discovered from scratch.

### Example layout

project/
├── ingest.py
├── ingest.doc.md              # documents ingest.py
├── raw_data.zip
├── raw_data.doc.md            # documents the zip contents and format
├── knowledge/
│   ├── api-authentication.md
│   ├── data-validation-rules.md
│   ├── deployment/
│   │   ├── staging-environment.md
│   │   └── production-checklist.md
│   └── third-party-services/
│       ├── service-a.md
│       └── service-b.md
## Temporary scripts

- Write temporary or exploratory scripts to ./tmp/<descriptive_name>.py.
- No inline execution. Never run Python code inline (e.g., python -c "..."). Always write a script file and run it.
- Delete after use. Remove temporary scripts once they have served their purpose. The tmp/ directory should stay clean.


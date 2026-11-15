# Security Policy

## Architecture & Privacy Posture

**SetHane** is a 100% static client-side Progressive Web App hosted on GitHub Pages:
- **No Backend / No Cloud Database:** SetHane does not transmit workout data, user preferences, or personal information to any external server.
- **No Authentication / No Credentials:** There are no user accounts, passwords, or API keys stored or processed.
- **Strict Import Validation:** All imported JSON backup files (`BackupPayloadV1`) are validated against strict `zod` schemas before being written to local `IndexedDB`.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security issue (such as Cross-Site Scripting via imported JSON payloads or dependency vulnerabilities), please report it privately via [GitHub Security Advisories](https://github.com/devenes/sethane/security/advisories/new) rather than opening a public issue.

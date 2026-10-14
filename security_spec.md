# Security Specification: Chat Sync

## Data Invariants
1. Chat messages must have a valid `sessionId`, `senderName`, `senderEmail`, `message`, and `timestamp`.
2. Users can only send messages as themselves (or as "Sari Sensei" if `isMaster` is true).
3. Chat messages are immutable after creation.
4. Messages must be scoped to a session.

## The Dirty Dozen Payloads
1. Create message with spoofed `senderEmail`.
2. Create message without `sessionId`.
3. Update existing message (should be denied).
4. Delete message (should be denied unless admin).
5. Create message with extremely long `message` string (exceeding limit).
6. Create message with invalid characters in `id`.
7. Create message where `isMaster` is true but user is not master.
8. Read messages from a session the user is not part of (if applicable).
9. Create message with future `timestamp`.
10. Create message with `senderName` that is too long.
11. Create message without authentication.
12. Create message with a malicious payload injection.

# StethoConnect Security Specification

## 1. Data Invariants

1. **Profile Identity**: A user profile document ID `{profileId}` must match the creator's authenticated UID (`request.auth.uid`). Users cannot impersonate another practitioner's UID.
2. **Profile Immutability**: The `id`, `handle`, and `createdAt` cannot be changed after creation.
3. **Post Ownership**: A post cannot be created or modified unless `incoming().authorId == request.auth.uid`.
4. **Post Deletion**: Only the author of the post can delete their own post.
5. **Post Reactions & Views**: When a user reacts or views a post, only the specific fields for their UID can be modified; users cannot delete other users' reactions or forge other users' views.
6. **Comment Authorship**: Comments require `incoming().authorId == request.auth.uid`. A user can only delete their own comment.
7. **Comment Likes**: Modifying comment likes requires toggling only the caller's UID.
8. **Follows**: `followerId` must match `request.auth.uid`. Users cannot forge follows on behalf of other clinicians or follow themselves.
9. **Reports**: `reporterId` must match `request.auth.uid`. Reports cannot be tampered with once submitted.
10. **String & Array Bounds**: All texts, handles, bios, and array lengths must adhere to strict volumetric limits to prevent Denial of Wallet.

## 2. The "Dirty Dozen" Malicious Payloads

1. **Identity Spoofing in Profile Creation**:
   - Authenticated as `user_123` trying to write to `/profiles/victim_456` with `id: "victim_456"`.
   - *Expected*: PERMISSION_DENIED.

2. **Handle Hijacking on Update**:
   - `user_123` attempts to update `/profiles/user_123` modifying `handle` to `dr_house`.
   - *Expected*: PERMISSION_DENIED (handle is immutable).

3. **Orphaned Post Write with Spoofed Author**:
   - `user_123` creates post with `authorId: "doctor_celebrity"`.
   - *Expected*: PERMISSION_DENIED (`authorId` must match auth UID).

4. **Malicious Post Content Oversize (Denial of Wallet)**:
   - `user_123` sends 10MB text payload in `text` field.
   - *Expected*: PERMISSION_DENIED (max length exceeded).

5. **Unauthorized Post Deletion**:
   - `user_123` tries to delete `/posts/post_owned_by_victim`.
   - *Expected*: PERMISSION_DENIED.

6. **Reaction Forgery**:
   - `user_123` modifies `/posts/p1` updating `reactions` to set `reactions["victim_456"] = "dislike"`.
   - *Expected*: PERMISSION_DENIED.

7. **Comment Authorship Impersonation**:
   - `user_123` creates comment on `/comments/c1` with `authorId: "surgeon_chief"`.
   - *Expected*: PERMISSION_DENIED.

8. **Unauthorized Comment Deletion**:
   - `user_123` tries to delete `/comments/c1` where `authorId == "user_456"`.
   - *Expected*: PERMISSION_DENIED.

9. **Follower Forgery**:
   - `user_123` attempts to create follow `/follows/f1` with `followerId: "influencer_doc"`.
   - *Expected*: PERMISSION_DENIED.

10. **Self-Follow Exploit**:
    - `user_123` attempts to create follow where `followerId == "user_123"` and `followeeId == "user_123"`.
    - *Expected*: PERMISSION_DENIED.

11. **Report Spoofing**:
    - `user_123` creates a report claiming `reporterId: "admin_user"`.
    - *Expected*: PERMISSION_DENIED.

12. **Tampering with Existing Report**:
    - `user_123` tries to update an existing report document.
    - *Expected*: PERMISSION_DENIED (reports are append-only/immutable).

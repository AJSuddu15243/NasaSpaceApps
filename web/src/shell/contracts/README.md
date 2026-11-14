# Temporary, exact FND-1 contract snapshot

These files are copied byte-for-byte from PR #65 at
`b46945ebfbb086149ab623cc4a79bd6c7c54a9fa`. Do not edit the snapshots.
Once FND-1 is merged, repoint imports to `web/src/contracts/` and schemas to the shared
schema package, then remove this folder. They live under WEB-1's shell scope to avoid
editing the shared contract owner's files. Engine value types remain PROPOSED upstream;
WEB-1 uses them only for explicitly synthetic fixtures, not a validated engine.

The mock UI uses `mean_sun_el_deg` as *mean* solar elevation; it does not substitute it for
instantaneous elevation. Thermal weighting is zero and hidden pending upstream sign-off.
Rock weighting is zero while there is no rock data. No contracts are changed by WEB-1.

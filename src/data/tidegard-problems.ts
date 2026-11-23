// Generated from the Tidegard repository's docs/api/error-codes.md. Regenerate
// from there rather than editing by hand, so the two never disagree.
// `meaning` is trusted, author-written HTML (escaped text plus <code>/<strong>).

export interface ProblemType {
  code: string;
  status: number;
  meaning: string;
}

export const problemTypes: ProblemType[] = [
  {
    "code": "api.unauthenticated",
    "status": 401,
    "meaning": "No usable credential. Sent with <code>WWW-Authenticate: Bearer</code>, and the same for every cause."
  },
  {
    "code": "api.forbidden",
    "status": 403,
    "meaning": "Authenticated, but lacking the permission, for a resource in the caller's own tenant."
  },
  {
    "code": "api.not_found",
    "status": 404,
    "meaning": "No such path or resource."
  },
  {
    "code": "api.method_not_allowed",
    "status": 405,
    "meaning": "The path exists, but not with this method."
  },
  {
    "code": "api.invalid_request",
    "status": 400,
    "meaning": "A malformed body, query or path parameter."
  },
  {
    "code": "api.unknown_field",
    "status": 400,
    "meaning": "The body has a field the endpoint does not define. Unknown fields are never ignored."
  },
  {
    "code": "api.unsupported_media_type",
    "status": 415,
    "meaning": "The body is not <code>application/json</code>."
  },
  {
    "code": "api.csrf_rejected",
    "status": 403,
    "meaning": "A request made with a session cookie that changes anything lacks the session's <code>X-WNM-CSRF</code> value, or has the wrong one."
  },
  {
    "code": "api.payload_too_large",
    "status": 413,
    "meaning": "The body is over 64 KiB."
  },
  {
    "code": "api.rate_limited",
    "status": 429,
    "meaning": "Over the rate limit. Sent with <code>Retry-After</code>."
  },
  {
    "code": "api.unavailable",
    "status": 503,
    "meaning": "The database cannot be reached. The API fails closed. Sent with <code>Retry-After</code>."
  },
  {
    "code": "api.internal",
    "status": 500,
    "meaning": "Unexpected. The body carries nothing but this code and the request id."
  },
  {
    "code": "api.tenant_required",
    "status": 400,
    "meaning": "A platform principal called an endpoint that acts in a tenant without naming one in the <code>Tidegard-Tenant</code> header."
  },
  {
    "code": "api.tenant_unknown",
    "status": 400,
    "meaning": "The <code>Tidegard-Tenant</code> header names no registered tenant. Sent only to platform principals; a tenant principal that names another tenant gets <code>api.forbidden</code>."
  },
  {
    "code": "incident.not_found",
    "status": 404,
    "meaning": "No such incident, <strong>or another tenant's</strong>. The two are indistinguishable by design."
  },
  {
    "code": "incident.illegal_transition",
    "status": 409,
    "meaning": "The state machine does not allow this transition from the current state."
  },
  {
    "code": "incident.version_conflict",
    "status": 409,
    "meaning": "<code>expected_version</code> is stale. Re-read the incident and retry."
  },
  {
    "code": "incident.idempotency_key_reuse",
    "status": 409,
    "meaning": "The <code>Idempotency-Key</code> was used for a different request."
  },
  {
    "code": "incident.forbidden",
    "status": 403,
    "meaning": "The domain refused the command for lack of a permission."
  },
  {
    "code": "incident.validation_failed",
    "status": 422,
    "meaning": "Well-formed, but semantically invalid, for example a suppression with no expiry."
  },
  {
    "code": "incident.limit_reached",
    "status": 409,
    "meaning": "A per-tenant bound, such as open incidents, is reached."
  },
  {
    "code": "incident.duplicate_active",
    "status": 409,
    "meaning": "An active incident for the same correlation key already exists."
  },
  {
    "code": "incident.invalid_reopen",
    "status": 409,
    "meaning": "The incident cannot be reopened, for example outside the reopen window."
  },
  {
    "code": "incident.manual_closure_required",
    "status": 409,
    "meaning": "This incident must be closed by an operator."
  },
  {
    "code": "incident.suppressed_operation",
    "status": 409,
    "meaning": "The operation is not allowed while the incident is suppressed."
  },
  {
    "code": "incident.evidence_unavailable",
    "status": 422,
    "meaning": "The evidence the command needs is not available."
  },
  {
    "code": "incident.state_unchanged",
    "status": 409,
    "meaning": "The command would not change anything."
  },
  {
    "code": "incident.clock_skew",
    "status": 503,
    "meaning": "The decision time ran backward. Retry."
  },
  {
    "code": "incident.correlation_conflict",
    "status": 409,
    "meaning": "The correlation key conflicts with an existing incident."
  },
  {
    "code": "incident.customer_visible_unsupported",
    "status": 501,
    "meaning": "A customer-visible note was asked for. Every note is internal in the current release."
  },
  {
    "code": "mitigation.not_found",
    "status": 404,
    "meaning": "No such mitigation, <strong>or another tenant's</strong>. The two are indistinguishable by design."
  },
  {
    "code": "mitigation.forbidden",
    "status": 403,
    "meaning": "The role lacks the mitigation permission."
  },
  {
    "code": "mitigation.illegal_transition",
    "status": 409,
    "meaning": "The mitigation's state does not allow this, for example approving one that is already active."
  },
  {
    "code": "mitigation.self_approval",
    "status": 403,
    "meaning": "The requester tried to approve their own mitigation, and the deployment does not allow it."
  },
  {
    "code": "mitigation.invalid",
    "status": 422,
    "meaning": "The request is well formed but not a valid mitigation: a prefix with host bits, an RTBH that is not a host route, ports without TCP or UDP, a reason or duration out of range."
  },
  {
    "code": "mitigation.duplicate",
    "status": 409,
    "meaning": "A live mitigation already does the same action on the same prefix and match."
  },
  {
    "code": "mitigation.version_conflict",
    "status": 409,
    "meaning": "<code>expected_version</code> is stale. Carries <code>current_version</code>."
  },
  {
    "code": "mitigation.idempotency_key_reuse",
    "status": 409,
    "meaning": "The <code>Idempotency-Key</code> was used for a different mitigation request."
  },
  {
    "code": "mitigation.kill_switch",
    "status": 409,
    "meaning": "The kill switch is on: no mitigation may start."
  },
  {
    "code": "mitigation.not_allowlisted",
    "status": 403,
    "meaning": "The prefix is not on this tenant's allowlist. Another tenant's prefix gets the same answer."
  },
  {
    "code": "mitigation.action_not_allowed",
    "status": 403,
    "meaning": "The allowlist entry does not permit this action."
  },
  {
    "code": "mitigation.too_wide",
    "status": 422,
    "meaning": "The prefix is wider than the configured minimum length."
  },
  {
    "code": "mitigation.too_long",
    "status": 422,
    "meaning": "The duration is over the configured maximum."
  },
  {
    "code": "tenant.not_found",
    "status": 404,
    "meaning": "No such tenant. Platform endpoints only."
  },
  {
    "code": "tenant.exists",
    "status": 409,
    "meaning": "A tenant with this id is already registered."
  },
  {
    "code": "tenant.invalid",
    "status": 422,
    "meaning": "A tenant id that is empty, over 128 characters or <code>platform</code>; a display name over 200 characters; or a prefix that is malformed, has host bits, or is wider than <code>/8</code> or <code>/16</code>."
  },
  {
    "code": "tenant.prefix_overlap",
    "status": 409,
    "meaning": "The prefix overlaps one already registered, to this tenant or another. Carries <code>existing</code> and <code>owner</code>."
  },
  {
    "code": "tenant.prefix_not_found",
    "status": 404,
    "meaning": "The tenant has no such prefix."
  },
  {
    "code": "token.not_found",
    "status": 404,
    "meaning": "No live token with this id in the tenant acted in."
  },
  {
    "code": "token.invalid",
    "status": 422,
    "meaning": "A lifetime out of range, a role from the other scope, or <code>automation</code> for a person. A role with any permission the issuer lacks is <code>api.forbidden</code>."
  }
];

/** The path segment the API uses in each problem `type` URI. */
export const problemSlug = (code: string) => code.replace(/[._]/g, '-');

#!/usr/bin/env bash
set -euo pipefail

# usage:
#   ./smoke-test.sh [HOST_URL]
# examples:
#   ./smoke-test.sh             # → http://localhost:8000
#   ./smoke-test.sh http://localhost        # Docker+nginx
#   ./smoke-test.sh http://localhost:8000   # direct backend

HOST=${1:-http://localhost:8000}
HOST=${HOST%/}  # strip trailing slash

# Derive API_URL
if [[ $HOST == *"/api/v1" ]]; then
  API_URL=$HOST
  HOST_URL=${HOST%/api/v1}
else
  HOST_URL=$HOST
  API_URL=$HOST_URL/api/v1
fi

echo "HOST_URL = $HOST_URL"
echo "API_URL  = $API_URL"
echo

# 1) health‑check
echo "👉 Testing health‑check…"
HC=$(curl -sL -o /dev/null -w "%{http_code}" "$HOST_URL/health")
if [[ $HC -eq 200 ]]; then
  echo "  ✓ health‑check returned 200"
else
  echo "  ✗ health‑check returned $HC (expected 200)"
  exit 1
fi
echo

# 2) unauth /projects
echo "👉 Testing unauthenticated $API_URL/projects (should 401)…"
UNAUTH=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/projects")
if [[ $UNAUTH -eq 401 ]]; then
  echo "  ✓ got 401 as expected"
else
  echo "  ✗ expected 401 but got $UNAUTH"
  exit 1
fi
echo

# Generate a fresh email for this run
EMAIL="smoke+$(date +%s)@example.com"
PW="test123"

# 3) register
echo "👉 Registering a new user…"
REG_RAW=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/register" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d "username=$EMAIL&password=$PW")
REG_BODY=$(echo "$REG_RAW" | sed '$d')
REG_CODE=$(echo "$REG_RAW" | tail -n1)

if [[ $REG_CODE -ne 201 ]]; then
  echo "  ✗ register returned HTTP $REG_CODE"
  echo "    response was: $REG_BODY"
  exit 1
fi

TOKEN=$(echo "$REG_BODY" | jq -r .access_token 2>/dev/null || true)
if [[ -z "$TOKEN" || "$TOKEN" == "null" ]]; then
  echo "  ✗ failed to parse token from register response:"
  echo "    $REG_BODY"
  exit 1
else
  echo "  ✓ got token: $TOKEN"
fi
echo

# 4) login
echo "👉 Logging in…"
LOGIN_RAW=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/auth/login" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d "username=$EMAIL&password=$PW")
LOGIN_BODY=$(echo "$LOGIN_RAW" | sed '$d')
LOGIN_CODE=$(echo "$LOGIN_RAW" | tail -n1)

if [[ $LOGIN_CODE -ne 200 ]]; then
  echo "  ✗ login returned HTTP $LOGIN_CODE"
  echo "    response was: $LOGIN_BODY"
  exit 1
fi

LOGIN_TOKEN=$(echo "$LOGIN_BODY" | jq -r .access_token 2>/dev/null || true)
if [[ -z "$LOGIN_TOKEN" || "$LOGIN_TOKEN" == "null" ]]; then
  echo "  ✗ failed to parse token from login response:"
  echo "    $LOGIN_BODY"
  exit 1
else
  TOKEN=$LOGIN_TOKEN
  echo "  ✓ login returned token: $TOKEN"
fi
echo

# 5) create project
echo "👉 Creating a project…"
curl -s -X POST "$API_URL/projects" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"SmokeProj","config":{"elements":[]}}' \
  | jq . && echo "  ✓ project created"
echo

# 6) list projects
echo "👉 Listing projects…"
curl -s -X GET "$API_URL/projects" \
  -H "Authorization: Bearer $TOKEN" \
  | jq . && echo "  ✓ projects listed"
echo

echo "🎉 All smoke tests passed!"
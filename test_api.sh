#!/bin/bash

# BugTrace API Test Script
# This script tests all major API endpoints

BASE_URL="http://localhost:5001"
echo "🧪 BugTrace API Testing Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    local token=$5
    
    echo -n "Testing: $description... "
    
    if [ -z "$token" ]; then
        response=$(curl -s -X $method -H "Content-Type: application/json" -d "$data" "$BASE_URL$endpoint")
    else
        response=$(curl -s -X $method -H "Content-Type: application/json" -H "Authorization: Bearer $token" -d "$data" "$BASE_URL$endpoint")
    fi
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ PASSED${NC}"
        ((TESTS_PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

echo "📝 Phase 1: Authentication"
echo "-------------------------"

# Test login
echo -n "Testing: Login with admin credentials... "
LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    -d '{"email":"admin@bugtrace.com","password":"password123"}' \
    "$BASE_URL/api/auth/login")

if echo "$LOGIN_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "   Token received: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
    echo "   Response: $LOGIN_RESPONSE"
    exit 1
fi

echo ""
echo "📂 Phase 2: Projects"
echo "-------------------"

# Get all projects
echo -n "Testing: Get all projects... "
PROJECTS_RESPONSE=$(curl -s -X GET -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/projects")
if echo "$PROJECTS_RESPONSE" | grep -q "BugTrace Web App"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
    PROJECT_ID=$(echo "$PROJECTS_RESPONSE" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "   Found project ID: $PROJECT_ID"
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

# Get single project
echo -n "Testing: Get single project... "
PROJECT_RESPONSE=$(curl -s -X GET -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/projects/$PROJECT_ID")
if echo "$PROJECT_RESPONSE" | grep -q "name"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "🐛 Phase 3: Issues"
echo "-----------------"

# Get all issues
echo -n "Testing: Get all issues... "
ISSUES_RESPONSE=$(curl -s -X GET -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/issues")
if echo "$ISSUES_RESPONSE" | grep -q "title"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
    ISSUE_ID=$(echo "$ISSUES_RESPONSE" | grep -o '"_id":"[^"]*' | head -1 | cut -d'"' -f4)
    echo "   Found issue ID: $ISSUE_ID"
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

# Get single issue
echo -n "Testing: Get single issue... "
ISSUE_RESPONSE=$(curl -s -X GET -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/issues/$ISSUE_ID")
if echo "$ISSUE_RESPONSE" | grep -q "description"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "💬 Phase 4: Comments"
echo "-------------------"

# Get comments for issue
echo -n "Testing: Get comments for issue... "
COMMENTS_RESPONSE=$(curl -s -X GET -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/issues/$ISSUE_ID/comments")
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

# Add comment to issue
echo -n "Testing: Add comment to issue... "
ADD_COMMENT_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"text":"Test comment from API"}' \
    "$BASE_URL/api/issues/$ISSUE_ID/comments")
if echo "$ADD_COMMENT_RESPONSE" | grep -q "Test comment"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "📊 Phase 5: Analytics"
echo "--------------------"

# Get dashboard overview
echo -n "Testing: Get dashboard analytics... "
ANALYTICS_RESPONSE=$(curl -s -X GET -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/analytics/overview")
if echo "$ANALYTICS_RESPONSE" | grep -q "statusBreakdown"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "👥 Phase 6: Users"
echo "----------------"

# Get all users
echo -n "Testing: Get all users... "
USERS_RESPONSE=$(curl -s -X GET -H "Authorization: Bearer $TOKEN" "$BASE_URL/api/auth/users")
if echo "$USERS_RESPONSE" | grep -q "admin"; then
    echo -e "${GREEN}✓ PASSED${NC}"
    ((TESTS_PASSED++))
    USER_COUNT=$(echo "$USERS_RESPONSE" | grep -o '"username"' | wc -l)
    echo "   Found $USER_COUNT users"
else
    echo -e "${RED}✗ FAILED${NC}"
    ((TESTS_FAILED++))
fi

echo ""
echo "================================"
echo "📈 Test Results"
echo "================================"
echo -e "${GREEN}✓ Passed: $TESTS_PASSED${NC}"
echo -e "${RED}✗ Failed: $TESTS_FAILED${NC}"
echo "Total: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed!${NC}"
    exit 1
fi

// scripts/test-role-system.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
const testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Test users (create these in your backend first or use existing ones)
const TEST_USERS = {
  SUPER_ADMIN: {
    email: 'superadmin@test.com',
    password: 'password123'
  },
  COMPANY_ADMIN: {
    email: 'companyadmin@test.com', 
    password: 'password123'
  },
  MEMBER: {
    email: 'member@test.com',
    password: 'password123'
  }
};

async function testCase(name: string, testFn: () => Promise<boolean>) {
  testResults.total++;
  try {
    const result = await testFn();
    if (result) {
      testResults.passed++;
      console.log(`✅ ${name}: PASSED`);
    } else {
      testResults.failed++;
      console.log(`❌ ${name}: FAILED`);
    }
  } catch (error: any) {
    testResults.failed++;
    console.log(`❌ ${name}: ERROR - ${error.message}`);
  }
}

async function loginUser(email: string, password: string) {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password
  });
  return response.data;
}

async function testRoleSystem() {
  console.log('🧪 STARTING ROLE SYSTEM TESTS...\n');

  // Test 1: Super Admin Login
  await testCase('Super Admin Login', async () => {
    const result = await loginUser(TEST_USERS.SUPER_ADMIN.email, TEST_USERS.SUPER_ADMIN.password);
    return result.success && result.user.role === 'super_admin';
  });

  // Test 2: Company Admin Login
  await testCase('Company Admin Login', async () => {
    const result = await loginUser(TEST_USERS.COMPANY_ADMIN.email, TEST_USERS.COMPANY_ADMIN.password);
    return result.success && result.user.role === 'company_admin';
  });

  // Test 3: Member Login
  await testCase('Member Login', async () => {
    const result = await loginUser(TEST_USERS.MEMBER.email, TEST_USERS.MEMBER.password);
    return result.success && result.user.role === 'member';
  });

  // Test 4: Super Admin gets all companies
  await testCase('Super Admin sees all companies', async () => {
    const loginResult = await loginUser(TEST_USERS.SUPER_ADMIN.email, TEST_USERS.SUPER_ADMIN.password);
    const token = loginResult.token;
    
    const response = await axios.get(`${API_BASE_URL}/companies`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.success && Array.isArray(response.data.companies);
  });

  // Test 5: Company Admin gets only their company
  await testCase('Company Admin sees only assigned company', async () => {
    const loginResult = await loginUser(TEST_USERS.COMPANY_ADMIN.email, TEST_USERS.COMPANY_ADMIN.password);
    const token = loginResult.token;
    const user = loginResult.user;
    
    const response = await axios.get(`${API_BASE_URL}/companies`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.success && 
           response.data.companies.length === 1 &&
           response.data.companies[0].id === user.assignedCompanyId;
  });

  // Test 6: Member gets only their company
  await testCase('Member sees only assigned company', async () => {
    const loginResult = await loginUser(TEST_USERS.MEMBER.email, TEST_USERS.MEMBER.password);
    const token = loginResult.token;
    const user = loginResult.user;
    
    const response = await axios.get(`${API_BASE_URL}/companies`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.data.success && 
           response.data.companies.length === 1 &&
           response.data.companies[0].id === user.assignedCompanyId;
  });

  // Test 7: Permission checks
  await testCase('Permission system - Super Admin has all', async () => {
    const loginResult = await loginUser(TEST_USERS.SUPER_ADMIN.email, TEST_USERS.SUPER_ADMIN.password);
    return loginResult.user.role === 'super_admin';
  });

  console.log('\n📊 TEST RESULTS:');
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`✅ Passed: ${testResults.passed}`);
  console.log(`❌ Failed: ${testResults.failed}`);
  console.log(`🎯 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);

  if (testResults.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Role system is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Check the errors above.');
  }
}

// Run the tests
testRoleSystem().catch(console.error);
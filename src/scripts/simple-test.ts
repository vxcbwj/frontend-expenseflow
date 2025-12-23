// Simple test - just check login
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/login";

async function testLogin(email: string, password: string) {
  try {
    console.log(`\n🔐 Testing: ${email}`);
    const response = await axios.post(API_URL, { email, password });

    if (response.data.success) {
      console.log(`✅ SUCCESS!`);
      console.log(`   Role: ${response.data.user.role}`);
      console.log(
        `   Company ID: ${
          response.data.user.assignedCompanyId || "None (Super Admin)"
        }`
      );
      return true;
    } else {
      console.log(`❌ Failed: ${response.data.message}`);
      return false;
    }
  } catch (error: any) {
    console.log(`❌ ERROR: ${error.message}`);
    if (error.response?.data?.error) {
      console.log(`   Details: ${error.response.data.error}`);
    }
    return false;
  }
}

async function runTests() {
  console.log("🧪 SIMPLE LOGIN TESTS");
  console.log("=====================\n");

  // Test with KNOWN passwords for your users
  await testLogin("super@admin.com", "password123");
  await testLogin("company@admin.com", "password123");
  await testLogin("employee@test.com", "password123");

  console.log("\n📋 Test Complete!");
}

runTests();

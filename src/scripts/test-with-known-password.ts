import axios from "axios";

const API_URL = "http://localhost:5000/api";

async function testAll() {
  console.log("🧪 TESTING ROLE SYSTEM WITH KNOWN PASSWORD");
  console.log("===========================================\n");

  // Try different common passwords
  const passwordAttempts = [
    "password123",
    "password",
    "123456",
    "admin123",
    "Password123",
    "Password@123",
  ];

  const users = [
    { email: "super@admin.com", expectedRole: "super_admin" },
    { email: "company@admin.com", expectedRole: "company_admin" },
    { email: "employee@test.com", expectedRole: "member" },
  ];

  for (const user of users) {
    console.log(`\n🔍 Testing: ${user.email}`);
    console.log("Expected role:", user.expectedRole);
    console.log("---");

    let success = false;

    for (const password of passwordAttempts) {
      try {
        console.log(`Trying password: "${password}"`);
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: user.email,
          password: password,
        });

        if (response.data.success) {
          console.log(`✅ FOUND CORRECT PASSWORD: "${password}"`);
          console.log(
            `   Role: ${response.data.user.role} ${
              response.data.user.role === user.expectedRole ? "✅" : "❌"
            }`
          );
          console.log(
            `   Company: ${response.data.user.assignedCompanyId || "None"}`
          );
          success = true;
          break;
        }
      } catch (error: any) {
        // Just continue to next password attempt
        if (error.response?.status === 401) {
          // Wrong password, try next
        } else {
          console.log(`   Error: ${error.message}`);
        }
      }
    }

    if (!success) {
      console.log(`❌ Could not find correct password for ${user.email}`);
      console.log(`   You may need to reset the password in MongoDB`);
    }
  }

  console.log("\n📋 Test Complete!");
}

testAll().catch(console.error);

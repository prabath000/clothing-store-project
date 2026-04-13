async function testAuth() {
  try {
    console.log('Testing Registration...');
    const registerRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        password: 'password123'
      })
    });
    const registerData = await registerRes.json();
    console.log('Registration Status:', registerRes.status);
    console.log('Registration Data:', registerData);

    if (registerRes.status === 201) {
      console.log('\nTesting Login...');
      const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: registerData.email,
          password: 'password123'
        })
      });
      const loginData = await loginRes.json();
      console.log('Login Status:', loginRes.status);
      console.log('Login Data:', loginData);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAuth();

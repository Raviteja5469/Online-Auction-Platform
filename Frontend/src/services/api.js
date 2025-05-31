export async function getDashboardData() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/user/dashboard', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard data');
  }
  return response.json();
}

export default function HomePage() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        Daily Expense Tracker
      </h1>
      <p style={{ fontSize: '20px', marginBottom: '30px' }}>
        AI-Powered Expense Tracking Application
      </p>
      <div>
        <a href="/signup" style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: '#6366f1',
          color: 'white',
          borderRadius: '8px',
          marginRight: '10px',
          textDecoration: 'none'
        }}>
          Get Started
        </a>
        <a href="/login" style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: 'transparent',
          color: '#6366f1',
          border: '2px solid #6366f1',
          borderRadius: '8px',
          textDecoration: 'none'
        }}>
          Sign In
        </a>
      </div>
    </div>
  );
}

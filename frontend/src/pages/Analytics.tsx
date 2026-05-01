import React, { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { API } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

const COLORS = ['#d4af37', '#22c55e', '#ef4444', '#f59e0b', '#3b82f6'];

const Analytics: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAnalytics = useCallback(async () => {
    try {
      const res = await API.get('/analytics');
      setData(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  const pieData = data ? [
    { name: 'Active', value: data.stats.active },
    { name: 'Revoked', value: data.stats.revoked },
    { name: 'Expired', value: data.stats.expired },
  ].filter(d => d.value > 0) : [];

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyChart = data?.monthlyData?.map((d: any) => ({ month: MONTHS[d._id.month - 1], count: d.count })) || [];

  const tooltipStyle = { background: 'var(--navy-card)', border: '1px solid var(--navy-border)', color: 'var(--text-primary)', borderRadius: 8, fontSize: 12 };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" style={{ width: 48, height: 48 }} />
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '100vh', padding: '100px 32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="alert alert-error">{error}</div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '100px 32px 60px', background: 'var(--navy)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40, animation: 'fadeInUp 0.5s ease forwards' }}>
          <img src={logo} alt="CertAuth" style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid var(--gold)', objectFit: 'cover' }} />
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(20px, 4vw, 30px)', color: 'var(--text-primary)' }}>
              Analytics <span className="gold-text">Dashboard</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Real-time certificate issuance and verification metrics</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Issued', value: data?.stats.total || 0, icon: '🎓', color: '#d4af37' },
            { label: 'Active', value: data?.stats.active || 0, icon: '✅', color: '#22c55e' },
            { label: 'Revoked', value: data?.stats.revoked || 0, icon: '❌', color: '#ef4444' },
            { label: 'Total Verifications', value: data?.stats.totalVerifications || 0, icon: '🔍', color: '#3b82f6' },
            { label: 'Expired', value: data?.stats.expired || 0, icon: '⏰', color: '#f59e0b' },
          ].map(stat => (
            <div key={stat.label} className="glass-card" style={{ padding: 20, border: `1px solid ${stat.color}20`, animation: 'fadeInUp 0.5s ease forwards' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>{stat.icon}</span>
                <span style={{ fontSize: 11, color: 'var(--text-secondary)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700 }}>{stat.label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: stat.color, fontWeight: 700 }}>{stat.value.toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Monthly Bar Chart */}
          <div className="glass-card" style={{ padding: 28, border: '1px solid var(--navy-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>Monthly Issuance</h3>
            {monthlyChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyChart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="var(--gold)" radius={[4, 4, 0, 0]} name="Certificates" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
                No data yet
              </div>
            )}
          </div>

          {/* Pie Chart */}
          <div className="glass-card" style={{ padding: 28, border: '1px solid var(--navy-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 24 }}>Status Distribution</h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 16 }}>
                  {pieData.map((d, i) => (
                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i] }} />
                      <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{d.name}</span>
                      <span style={{ color: COLORS[i], fontWeight: 700 }}>{d.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
                No data yet
              </div>
            )}
          </div>
        </div>

        {/* Recent + Top Institutions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Recent Certs */}
          <div className="glass-card" style={{ padding: 28, border: '1px solid var(--navy-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Recent Certificates</h3>
            {data?.recentCerts?.length > 0 ? data.recentCerts.map((cert: any) => (
              <div key={cert.certificateId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--navy-border)' }}>
                <div>
                  <div style={{ color: 'var(--text-primary)', fontSize: 13, fontWeight: 700 }}>{cert.studentName}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-display)', letterSpacing: 0.5, marginTop: 2 }}>{cert.certificateId}</div>
                </div>
                <span className={`badge badge-${cert.status}`}>{cert.status}</span>
              </div>
            )) : <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No certificates yet</p>}
          </div>

          {/* Top Institutions */}
          <div className="glass-card" style={{ padding: 28, border: '1px solid var(--navy-border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20 }}>Top Institutions</h3>
            {data?.topInstitutions?.length > 0 ? data.topInstitutions.map((inst: any, i: number) => (
              <div key={inst._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--navy-border)' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: `${COLORS[i]}20`, border: `1px solid ${COLORS[i]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: COLORS[i] }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, color: 'var(--text-primary)', fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{inst._id || 'Unknown'}</div>
                <div style={{ color: 'var(--gold)', fontWeight: 700, fontSize: 14 }}>{inst.count}</div>
              </div>
            )) : <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

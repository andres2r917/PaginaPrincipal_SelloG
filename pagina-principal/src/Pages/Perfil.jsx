import { useState } from "react";
import "../Style/Perfil.css";
import { Link } from 'react-router-dom';
const reports = [
  {
    id: 1,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_oHCxkvvVZttvDlIZInud-dB3HsovpUTXb6BI4kV8NJ8U9vzfE9_TrQidYCeKmN9EdBX02a0ImBCtzl8JhubJmkbMVeYGGsEj-g1zUts-sRuHkjdmVpWURstqhfWKO7rHH0XYfuZ2-76P2jVTgz2PqQdiKu7LLRjiTo6XH78f4eBT8_NungQG3fMmKOc5Ic5oPJq_Nko-EsQXIn6uROQn03otZKCZWOxxphRKVvvhtJ_UhEdCJPvBpUmLdDFkriETjeav7Qck2Mk",
    alt: "Gato rescatado",
    title: "Gato en riesgo - Calle Florida",
    badge: "Urgente",
    badgeClass: "badge--urgent",
    description: "Gato atigrado herido encontrado cerca de la estación. Requiere atención veterinaria inmediata y resguardo temporal.",
    time: "Reportado hace 2 horas",
    actionLabel: "Ver detalles",
    dimmed: false,
  },
  {
    id: 2,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCidGOwJh7OuH20BRKOZNCW8jTiSk5ssmdsnRBKLCR_avM3xg6Bz9oAC2U-P9Feow1gUUNrK0ZNMT-asKasjEoyzSU2v1qYMFVPaZSwFXeZW_5fjhwNDpvMCBW_WM538doXooU_zPeK7uhH2Yky6YTSGEPfaQKVbQZW9gBYMI9OwRsnsE1Nn9pxej6XU3yPW2bKv1BuO8jWinlH613GhICp0yqowRse2yhkN8FE-E1TzHpPMEUShvUzp27oRIvK3FmqNRb4ibKKwR4",
    alt: "Perro en tránsito",
    title: "Pochoclo - Búsqueda de Hogar",
    badge: "En Proceso",
    badgeClass: "badge--process",
    description: "Pochoclo ya está recuperado de su cirugía. Estamos evaluando familias candidatas para su adopción definitiva.",
    time: "Reportado hace 15 días",
    actionLabel: "Ver detalles",
    dimmed: false,
  },
  {
    id: 3,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDT0mBmpLfw2jII7kLsqignn0N-tVjM8S0wlfIMsf_fvQVA-0FGaFe-Py3qIvqVM4xCTfnpYyJ5M6D8tTK7IhZ9YermUed9TXK__9KkLjOQFgIknIrX0dzKtOcolWK9suT92XcxLap9fzWAdhflwIpxEP7HBx8jSOKYvLSPBr4u8yABLQOprpflvmroA_igMGq0Usrl_LPS7bUvLb1eNZ5RxAWNP58vE09n1uDdUtn385ShD4vfdlIgjTcUvY8rrzaX0D51naW4oPY",
    alt: "Cachorros adoptados",
    title: "Cachorros abandonados (3)",
    badge: "Completado",
    badgeClass: "badge--done",
    description: "Los tres cachorros han sido ubicados con familias responsables. Seguimiento finalizado con éxito.",
    time: "Reportado hace 1 mes",
    actionLabel: "Ver resumen",
    dimmed: true,
  },
];

const TABS = ["Mis Reportes", "Mascotas Favoritas", "Configuración"];

export default function Profile() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="profile-wrapper">
      {/* Profile Header */}
      <section className="profile-header">
        <div className="profile-avatar-wrap">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIEKJULtkP0HHIEG9z2ggX6AH06bDInxyCkQJijzlw5B-Ayo32zJA812zK-fZPdxJgGG2Io8BpJICjx34M_H7Ol6I8vLgp1QWTsUhDUq2ws5FqA_ptu8Odz52m8qpFwPLFEQOD5ruTEnnS-DsVermYShsBo3hIuIN1T5vJvrlgKWnJIc5_F3Jtdw0on0Vi2w0ggSGYHLqn85JVEEYJhJ8IpV-9E3PWs5nTvkCE7WhFVl4r2eJ1-kTxWuDBUvyFgBQ-JUcjzAUi6uM"
            alt="Mariana Costa Profile"
            className="profile-avatar"
          />
          <div className="profile-verified-badge">✓</div>
        </div>

        <div className="profile-info">
          <h1 className="profile-name">Mariana Costa</h1>
          <div className="profile-meta">
            <span className="profile-meta-item">📍 Buenos Aires, Argentina</span>
            <span className="profile-meta-item">📅 Miembro desde Mayo 2023</span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn btn--primary">Editar Perfil</button>
          <button className="btn btn--secondary">Compartir</button>
        </div>
      </section>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-card--primary">
          <span className="stat-icon">🐾</span>
          <span className="stat-value">12</span>
          <span className="stat-label">Rescates Reportados</span>
        </div>
        <div className="stat-card stat-card--secondary">
          <span className="stat-icon">🏠</span>
          <span className="stat-value">3</span>
          <span className="stat-label">Mascotas en Tránsito</span>
        </div>
        <div className="stat-card stat-card--tertiary">
          <span className="stat-icon">🤝</span>
          <span className="stat-value">8</span>
          <span className="stat-label">Donaciones Realizadas</span>
        </div>
      </div>

      {/* Main + Sidebar */}
      <div className="profile-content">
        {/* Tabbed Reports */}
        <div className="reports-panel">
          <div className="tabs">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                className={`tab ${activeTab === i ? "tab--active" : ""}`}
                onClick={() => setActiveTab(i)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="reports-list">
            {activeTab === 0 &&
              reports.map((r) => (
                <div key={r.id} className={`report-card ${r.dimmed ? "report-card--dimmed" : ""}`}>
                  <img src={r.img} alt={r.alt} className="report-img" />
                  <div className="report-body">
                    <div className="report-header">
                      <h3 className="report-title">{r.title}</h3>
                      <span className={`badge ${r.badgeClass}`}>{r.badge}</span>
                    </div>
                    <p className="report-desc">{r.description}</p>
                    <div className="report-footer">
                      <span className="report-time">{r.time}</span>
                      <button className="link-btn">{r.actionLabel}</button>
                    </div>
                  </div>
                </div>
              ))}

            {activeTab === 1 && (
              <p className="tab-placeholder">No hay mascotas favoritas aún.</p>
            )}
            {activeTab === 2 && (
              <p className="tab-placeholder">Configuración próximamente.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="sidebar">
          {/* Impact Card */}
          <div className="sidebar-card">
            <h2 className="sidebar-title">Tu Impacto</h2>
            <div className="impact-level">
              <div className="impact-icon">🛡️</div>
              <div>
                <p className="impact-rank">Nivel: Guardián de Plata</p>
                <p className="impact-points">320 / 500 Puntos</p>
              </div>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: "64%" }} />
            </div>
            <p className="progress-hint">
              Te faltan 180 puntos para el rango <strong>Protector de Oro</strong>.
            </p>

            <div className="achievements">
              <h3 className="achievements-title">Logros Recientes</h3>
              <div className="achievements-list">
                <span className="achievement-icon" title="Primer Rescate">🏆</span>
                <span className="achievement-icon" title="Donante Activo">❤️</span>
                <span className="achievement-icon" title="Hogar de Tránsito">🏡</span>
              </div>
            </div>
          </div>

          {/* Community Widget */}
          <div className="sidebar-card">
            <div className="community-header">
              <h2 className="sidebar-title">Comunidad Local</h2>
              <span className="notif-icon">🔔</span>
            </div>
            <ul className="community-list">
              <li className="community-item">
                <span className="dot dot--primary" />
                <div>
                  <p className="community-item-title">Nueva alerta en Palermo</p>
                  <p className="community-item-desc">Perro perdido visto hace 10 min en Plaza Italia.</p>
                </div>
              </li>
              <li className="community-item">
                <span className="dot dot--secondary" />
                <div>
                  <p className="community-item-title">Campaña de Vacunación</p>
                  <p className="community-item-desc">Este Sábado en el Centro Comunal Nº 14.</p>
                </div>
              </li>
              <li className="community-item">
                <span className="dot dot--primary" />
                <div>
                  <p className="community-item-title">Marta S. rescató un cachorro</p>
                  <p className="community-item-desc">¡Felicita a tu vecina por su acción!</p>
                </div>
              </li>
            </ul>
            <button className="btn btn--outline btn--full">Ver Mapa de Actividad</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
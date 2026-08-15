import { ChevronDown, ChevronLeft, ChevronRight, Search } from 'lucide-react';

export function AdminStatCard({ icon: Icon, label, value, trend, tone = 'green' }) {
  const isDown = trend?.startsWith('-');
  return (
    <article className="admin-stat-card">
      <span className={`admin-stat-icon tone-${tone}`}>
        <Icon size={22} />
      </span>
      <div>
        <span className="admin-stat-label">{label}</span>
        <strong>{value}</strong>
        {trend && <small className={isDown ? 'trend-down' : 'trend-up'}>{trend} <span>vs last 7 days</span></small>}
      </div>
    </article>
  );
}

export function AdminButton({ children, icon: Icon, variant = 'soft', className = '', ...props }) {
  return (
    <button className={`admin-button admin-button-${variant} ${className}`} type="button" {...props}>
      {Icon && <Icon size={18} />}
      <span>{children}</span>
    </button>
  );
}

export function SearchBox({ placeholder }) {
  return (
    <label className="admin-search">
      <Search size={19} />
      <input type="search" placeholder={placeholder} />
    </label>
  );
}

export function StatusBadge({ children, tone = 'green' }) {
  return <span className={`admin-badge tone-${tone}`}>{children}</span>;
}

export function Avatar({ src, initials, name }) {
  return src ? (
    <img className="admin-avatar" src={src} alt={name} />
  ) : (
    <span className="admin-avatar">{initials}</span>
  );
}

export function TablePagination({ totalLabel, lastPage = '1,285' }) {
  return (
    <div className="admin-pagination">
      <span>{totalLabel}</span>
      <div className="admin-pagination-controls">
        <button type="button" disabled><ChevronLeft size={17} /></button>
        <button className="is-active" type="button">1</button>
        <button type="button">2</button>
        <button type="button">3</button>
        <span>...</span>
        <button type="button">{lastPage}</button>
        <button type="button"><ChevronRight size={17} /></button>
        <button className="admin-page-size" type="button">10 / page <ChevronDown size={16} /></button>
      </div>
    </div>
  );
}

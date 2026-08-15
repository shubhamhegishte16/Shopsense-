import { Download, Eye, FileText, Filter, MoreVertical, Shield, Trash2, UserCheck, UserPlus, Users } from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { AdminButton, AdminStatCard, Avatar, SearchBox, StatusBadge, TablePagination } from '../../components/Admin/AdminUI';
import { users } from './adminData';

const stats = [
  [Users, 'Total Users', '12,846', '+12.5%', 'teal'],
  [UserPlus, 'New Users (This Week)', '1,243', '+12.8%', 'green'],
  [UserCheck, 'Active Users', '9,842', '+8.4%', 'teal'],
  [Shield, 'Suspended Users', '68', '-2.9%', 'red'],
  [Trash2, 'Deleted Users', '156', '-10.3%', 'orange'],
];

export default function UserManagement() {
  return (
    <AdminLayout
      title="User Management"
      subtitle="View and manage all registered users on the platform."
      actions={(
        <>
          <SearchBox placeholder="Search by name or email..." />
          <AdminButton icon={Filter}>Filter</AdminButton>
          <AdminButton icon={Download} variant="primary">Export</AdminButton>
        </>
      )}
    >
      <div className="admin-stat-grid">
        {stats.map(([icon, label, value, trend, tone]) => (
          <AdminStatCard key={label} icon={icon} label={label} value={value} trend={trend} tone={tone} />
        ))}
      </div>

      <section className="admin-table-card">
        <div className="admin-table-title"><h2>All Users</h2></div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th><th>User</th><th>Email</th><th>Registered On</th><th>Status</th><th>Receipts</th><th>Total Spending</th><th>Last Active</th><th>Reported Issues</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(([name, email, date, status, receipts, spending, active, issues, img], index) => (
                <tr key={email}>
                  <td>{index + 1}</td>
                  <td><div className="admin-person"><Avatar src={img} initials={name.split(' ').map((p) => p[0]).join('')} name={name} /><strong>{name}</strong></div></td>
                  <td>{email}</td>
                  <td>{date}</td>
                  <td><StatusBadge tone={status === 'Active' ? 'green' : status === 'Inactive' ? 'orange' : 'red'}>{status}</StatusBadge></td>
                  <td>{receipts}</td>
                  <td>&#8377;{spending}</td>
                  <td>{active}</td>
                  <td>{issues}</td>
                  <td><div className="admin-row-actions"><button><Eye size={16} /></button><button><FileText size={16} /></button><button><MoreVertical size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination totalLabel="Showing 1 to 10 of 12,846 users" />
      </section>
    </AdminLayout>
  );
}

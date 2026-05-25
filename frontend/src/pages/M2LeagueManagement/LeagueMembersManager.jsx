import { useState, useEffect } from 'react';
import {
  getLeagueMembersByLeague,
  removeLeagueMember,
  updateLeagueMember,
} from '../../api/leaguesApi';
import ConfirmModal from '../../components/ConfirmModal';
import Loader from '../../components/Loader';
import './LeagueMembersManager.css';

export default function LeagueMembersManager({ league }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    if (league) {
      fetchMembers();
    }
  }, [league]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLeagueMembersByLeague(league.id);
      setMembers(data);
    } catch (err) {
      setError('Error al cargar los miembros: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (member) => {
    setMemberToDelete(member);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await removeLeagueMember(memberToDelete.id);
      setMembers(members.filter(m => m.id !== memberToDelete.id));
      setShowDeleteConfirm(false);
      setMemberToDelete(null);
    } catch (err) {
      setError('Error al eliminar el miembro: ' + err.message);
      console.error(err);
    }
  };

  const handleEditStart = (member) => {
    setEditingMemberId(member.id);
    setEditFormData({
      team_name: member.team_name,
      status: member.status,
    });
  };

  const handleEditSave = async (memberId) => {
    try {
      await updateLeagueMember(memberId, editFormData);
      setMembers(members.map(m =>
        m.id === memberId ? { ...m, ...editFormData } : m
      ));
      setEditingMemberId(null);
      setEditFormData({});
    } catch (err) {
      setError('Error al actualizar el miembro: ' + err.message);
      console.error(err);
    }
  };

  const handleEditCancel = () => {
    setEditingMemberId(null);
    setEditFormData({});
  };

  if (loading) return <Loader />;

  return (
    <div className="league-members-container">
      <div className="members-header">
        <h3>Miembros de la Liga ({members.length}/{league.max_members})</h3>
        <span className="progress-bar">
          <span
            className="progress-fill"
            style={{
              width: `${(members.length / league.max_members) * 100}%`,
            }}
          ></span>
        </span>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {members.length === 0 ? (
        <div className="empty-state">
          <p>No hay miembros en esta liga aún</p>
        </div>
      ) : (
        <div className="members-table-wrapper">
          <table className="members-table">
            <thead>
              <tr>
                <th>Equipo</th>
                <th>Usuario</th>
                <th>Puntos</th>
                <th>Estado</th>
                <th>Agregado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member.id}>
                  <td>
                    {editingMemberId === member.id ? (
                      <input
                        type="text"
                        value={editFormData.team_name}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            team_name: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                    ) : (
                      member.team_name
                    )}
                  </td>
                  <td>{member.user?.username || member.user}</td>
                  <td className="points-cell">
                    <strong>{member.total_points}</strong>
                  </td>
                  <td>
                    {editingMemberId === member.id ? (
                      <select
                        value={editFormData.status}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            status: e.target.value,
                          })
                        }
                        className="form-select"
                      >
                        <option value="active">Activo</option>
                        <option value="inactive">Inactivo</option>
                        <option value="suspended">Suspendido</option>
                      </select>
                    ) : (
                      <span className={`badge badge-${member.status}`}>
                        {member.status}
                      </span>
                    )}
                  </td>
                  <td>
                    <small>
                      {new Date(member.joined_at).toLocaleDateString('es-ES')}
                    </small>
                  </td>
                  <td className="actions-cell">
                    {editingMemberId === member.id ? (
                      <>
                        <button
                          className="btn btn-xs btn-success"
                          onClick={() => handleEditSave(member.id)}
                        >
                          Guardar
                        </button>
                        <button
                          className="btn btn-xs btn-secondary"
                          onClick={handleEditCancel}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-xs btn-secondary"
                          onClick={() => handleEditStart(member)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn btn-xs btn-danger"
                          onClick={() => handleDelete(member)}
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showDeleteConfirm && (
        <ConfirmModal
          title="Eliminar Miembro"
          message={`¿Estás seguro de que deseas eliminar al miembro "${memberToDelete?.team_name}" de la liga?`}
          onConfirm={confirmDelete}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setMemberToDelete(null);
          }}
        />
      )}
    </div>
  );
}

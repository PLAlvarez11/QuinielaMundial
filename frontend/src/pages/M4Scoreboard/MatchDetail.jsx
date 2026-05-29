import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft, FiCalendar, FiClock, FiMapPin, FiShield, FiHash } from 'react-icons/fi';
import Loader from '../../components/Loader';
import { getMatchById } from '../../api/catalogoApi';
import './MatchDetail.css';

function formatDate(dateStr) {
  if (!dateStr) return '—';

  try {
    return new Date(dateStr).toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function MatchDetail() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFetchingRef = useRef(false);
  const POLL_MS = 5000;

  useEffect(() => {
    let cancelled = false;
    let timeoutId = null;

    async function fetchMatch() {
      if (!matchId) {
        setError('No se indicó un partido válido.');
        setLoading(false);
        return;
      }

      if (isFetchingRef.current) return;
      isFetchingRef.current = true;

      setLoading(true);
      setError(null);

      try {
        const response = await getMatchById(matchId);
        if (!cancelled) {
          setMatch(response.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.response?.data?.detail || 'No se pudo cargar el detalle del partido.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
        isFetchingRef.current = false;
      }
    }

    const poll = async () => {
      if (cancelled) return;
      await fetchMatch();
      if (cancelled) return;
      timeoutId = setTimeout(poll, POLL_MS);
    };

    poll();

    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [matchId]);

  const normalized = useMemo(() => {
    if (!match) return null;

    return {
      ...match,
      homeTeam: match.home_team_name || match.home_team?.name || match.home_team,
      awayTeam: match.away_team_name || match.away_team?.name || match.away_team,
      stadiumName: match.stadium_name || match.stadium?.name || match.stadium,
      stageName: match.stage_name || match.stage?.name || match.stage,
      groupName: match.group_name || match.group?.name || match.group,
    };
  }, [match]);

  if (loading) {
    return <Loader message="Cargando detalle del partido…" />;
  }

  if (error) {
    return (
      <div className="match-detail">
        <button type="button" className="match-detail__back" onClick={() => navigate('/m4-scoreboard')}>
          <FiArrowLeft size={16} aria-hidden="true" />
          Volver al marcador
        </button>
        <div className="match-detail__error" role="alert">
          <p>{error}</p>
          <button type="button" className="match-detail__retry" onClick={() => navigate(0)}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!normalized) {
    return null;
  }

  return (
    <div className="match-detail">
      <button type="button" className="match-detail__back" onClick={() => navigate('/m4-scoreboard')}>
        <FiArrowLeft size={16} aria-hidden="true" />
        Volver al marcador
      </button>

      <header className="match-detail__hero">
        <div className="match-detail__round">
          <FiHash size={14} aria-hidden="true" />
          Jornada {normalized.round_number || '—'}
        </div>
        <h1 className="match-detail__title">
          {normalized.homeTeam} vs {normalized.awayTeam}
        </h1>
        <div className="match-detail__status match-detail__status--scheduled">
          Actualización automática
        </div>
      </header>

      <section className="match-detail__scoreboard" aria-label="Resultado del partido">
        <div className="match-detail__team">
          <span className="match-detail__team-label">Local</span>
          <strong className="match-detail__team-name">{normalized.homeTeam}</strong>
          <span className="match-detail__score">{normalized.home_score ?? '—'}</span>
        </div>

        <div className="match-detail__vs">vs</div>

        <div className="match-detail__team">
          <span className="match-detail__team-label">Visitante</span>
          <strong className="match-detail__team-name">{normalized.awayTeam}</strong>
          <span className="match-detail__score">{normalized.away_score ?? '—'}</span>
        </div>
      </section>

      <section className="match-detail__info">
        <article className="match-detail__card">
          <FiCalendar size={18} aria-hidden="true" />
          <div>
            <span className="match-detail__label">Fecha y hora</span>
            <strong>{formatDate(normalized.match_date)}</strong>
          </div>
        </article>

        <article className="match-detail__card">
          <FiMapPin size={18} aria-hidden="true" />
          <div>
            <span className="match-detail__label">Estadio</span>
            <strong>{normalized.stadiumName || '—'}</strong>
          </div>
        </article>

        <article className="match-detail__card">
          <FiShield size={18} aria-hidden="true" />
          <div>
            <span className="match-detail__label">Fase</span>
            <strong>{normalized.stageName || '—'}</strong>
          </div>
        </article>

        <article className="match-detail__card">
          <FiClock size={18} aria-hidden="true" />
          <div>
            <span className="match-detail__label">Grupo / Estado</span>
            <strong>{normalized.groupName || '—'}</strong>
          </div>
        </article>
      </section>

      <section className="match-detail__summary">
        <div>
          <span className="match-detail__label">Marcador</span>
          <strong>
            {normalized.home_score ?? '—'} - {normalized.away_score ?? '—'}
          </strong>
        </div>
        <p>La información se refresca automáticamente cada 5 segundos.</p>
      </section>

      <div className="match-detail__footer">
        <Link className="match-detail__link" to="/m4-scoreboard">
          Volver a la tabla y partidos
        </Link>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { FiSave, FiTrash2, FiClock, FiLock, FiCheckCircle } from 'react-icons/fi';
import { useMatchDeadline } from './hooks/useMatchDeadline';
import './MatchCard.css';

// ── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_LABELS = {
  scheduled: 'Programado',
  in_progress: 'En curso',
  finished: 'Finalizado',
  cancelled: 'Cancelado',
};

function formatMatchDate(dateStr) {
  if (!dateStr) return '—';
  return new Intl.DateTimeFormat('es-GT', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr));
}

function extractErrorMessage(err) {
  const data = err?.response?.data;
  if (!data) return 'Error al guardar el vaticinio.';
  if (typeof data === 'string') return data;
  const nonField = data.non_field_errors;
  if (Array.isArray(nonField) && nonField.length) return nonField[0];
  if (data.detail) return data.detail;
  // Pick first field error
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (Array.isArray(val) && val.length) return val[0];
  }
  return 'Error al guardar el vaticinio.';
}

// ── Sub-components ────────────────────────────────────────────────────────────

function PointsBadge({ points }) {
  if (points === null || points === undefined) return null;

  if (points === 3) {
    return (
      <span className="points-badge points-badge--exact" aria-label="3 puntos: marcador exacto">
        🏆 3 pts — ¡Marcador exacto!
      </span>
    );
  }
  if (points === 1) {
    return (
      <span className="points-badge points-badge--partial" aria-label="1 punto: resultado correcto">
        ✅ 1 pt — Resultado correcto
      </span>
    );
  }
  return (
    <span className="points-badge points-badge--zero" aria-label="0 puntos">
      0 pts
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

/**
 * MatchCard — displays a single match and its prediction form.
 *
 * Props:
 *   match       — Match object from the catalog API
 *   prediction  — Existing Prediction object (or null)
 *   onSave      — (matchId, scores, existingId?) => Promise
 *   onDelete    — (matchId, predictionId) => Promise
 */
const MatchCard = ({ match, prediction, onSave, onDelete }) => {
  const { isClosed, minutesLeft } = useMatchDeadline(match.match_date);

  const [homeScore, setHomeScore] = useState(
    prediction?.predicted_home_score ?? ''
  );
  const [awayScore, setAwayScore] = useState(
    prediction?.predicted_away_score ?? ''
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fieldError, setFieldError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Sync local input state when the prediction changes (e.g. after save or delete)
  useEffect(() => {
    setHomeScore(prediction?.predicted_home_score ?? '');
    setAwayScore(prediction?.predicted_away_score ?? '');
  }, [prediction?.id]);

  const isFinished = match.status === 'finished';
  const isCancelled = match.status === 'cancelled';
  const isInProgress = match.status === 'in_progress';

  // Inputs are disabled when the deadline passed, match is done/cancelled/live, or while saving
  const inputDisabled = isClosed || isFinished || isCancelled || isInProgress || saving;

  // Only show save button when the user changed something
  const isDirty =
    String(homeScore) !== String(prediction?.predicted_home_score ?? '') ||
    String(awayScore) !== String(prediction?.predicted_away_score ?? '');

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (homeScore === '' || awayScore === '') {
      setFieldError('Ingresá el marcador para ambos equipos.');
      return;
    }

    setSaving(true);
    setFieldError(null);
    setSuccess(false);

    try {
      await onSave(
        match.id,
        {
          predicted_home_score: Number(homeScore),
          predicted_away_score: Number(awayScore),
        },
        prediction?.id
      );
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setFieldError(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!prediction?.id) return;
    setDeleting(true);
    setFieldError(null);
    try {
      await onDelete(match.id, prediction.id);
      // State is cleaned up by the parent hook; component re-renders with prediction=null
    } catch (err) {
      const msg = err?.response?.data?.detail || 'Error al eliminar el vaticinio.';
      setFieldError(msg);
      setDeleting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <article
      className={`match-card match-card--${match.status}`}
      aria-label={`Partido: ${match.home_team_name} vs ${match.away_team_name}`}
    >
      {/* ── Header: status + date ── */}
      <header className="match-card__header">
        <span
          className={`status-badge status-badge--${match.status}`}
          aria-label={`Estado: ${STATUS_LABELS[match.status] ?? match.status}`}
        >
          {STATUS_LABELS[match.status] ?? match.status}
        </span>
        <time
          className="match-card__date"
          dateTime={match.match_date}
          aria-label={`Fecha: ${formatMatchDate(match.match_date)}`}
        >
          <FiClock size={13} aria-hidden="true" />
          {formatMatchDate(match.match_date)}
        </time>
      </header>

      {/* ── Stage / group ── */}
      {match.stage_name && (
        <p className="match-card__stage" aria-label={`Fase: ${match.stage_name}`}>
          {match.stage_name}
          {match.group_name ? ` · Grupo ${match.group_name}` : ''}
        </p>
      )}

      {/* ── Teams & score ── */}
      <div className="match-card__teams" aria-label="Equipos">
        <div className="team team--home">
          <span className="team__name">{match.home_team_name}</span>
        </div>

        <div className="match-card__center">
          {isFinished ? (
            <span
              className="final-score"
              aria-label={`Resultado final: ${match.home_score} - ${match.away_score}`}
            >
              {match.home_score ?? '?'} — {match.away_score ?? '?'}
            </span>
          ) : (
            <span className="vs-label" aria-hidden="true">VS</span>
          )}
        </div>

        <div className="team team--away">
          <span className="team__name">{match.away_team_name}</span>
        </div>
      </div>

      {/* ── Points badge (after scoring) ── */}
      {prediction?.is_scored && (
        <div className="match-card__points">
          <PointsBadge points={prediction.points} />
        </div>
      )}

      {/* ── Deadline / warning banners ── */}
      {isClosed && !isFinished && !isCancelled && (
        <div className="deadline-banner" role="alert" aria-live="polite">
          <FiLock size={14} aria-hidden="true" />
          <span>Pronósticos cerrados — falta menos de 15 minutos para el inicio.</span>
        </div>
      )}

      {!isClosed && minutesLeft !== null && minutesLeft <= 30 && minutesLeft > 0 && (
        <div className="deadline-warning" role="status" aria-live="polite">
          <FiClock size={14} aria-hidden="true" />
          <span>¡Cierra en {minutesLeft} min!</span>
        </div>
      )}

      {/* ── Prediction form ── */}
      {!isCancelled && (
        <form
          onSubmit={handleSubmit}
          className="prediction-form"
          noValidate
          aria-label={`Formulario de vaticinio para ${match.home_team_name} vs ${match.away_team_name}`}
        >
          <div className="prediction-form__scores" role="group" aria-label="Marcador pronosticado">
            {/* Home score */}
            <div className="score-field">
              <label
                htmlFor={`home-score-${match.id}`}
                className="score-label"
              >
                {match.home_team_name}
              </label>
              <input
                id={`home-score-${match.id}`}
                type="number"
                inputMode="numeric"
                min="0"
                max="99"
                value={homeScore}
                onChange={(e) => {
                  setHomeScore(e.target.value);
                  setFieldError(null);
                }}
                disabled={inputDisabled}
                className="score-input"
                aria-describedby={fieldError ? `error-${match.id}` : undefined}
                aria-disabled={inputDisabled}
                placeholder="0"
              />
            </div>

            <span className="score-separator" aria-hidden="true">—</span>

            {/* Away score */}
            <div className="score-field">
              <label
                htmlFor={`away-score-${match.id}`}
                className="score-label"
              >
                {match.away_team_name}
              </label>
              <input
                id={`away-score-${match.id}`}
                type="number"
                inputMode="numeric"
                min="0"
                max="99"
                value={awayScore}
                onChange={(e) => {
                  setAwayScore(e.target.value);
                  setFieldError(null);
                }}
                disabled={inputDisabled}
                className="score-input"
                aria-describedby={fieldError ? `error-${match.id}` : undefined}
                aria-disabled={inputDisabled}
                placeholder="0"
              />
            </div>
          </div>

          {/* Field-level error */}
          {fieldError && (
            <p
              id={`error-${match.id}`}
              className="prediction-error"
              role="alert"
              aria-live="assertive"
            >
              {fieldError}
            </p>
          )}

          {/* Success confirmation */}
          {success && (
            <p
              className="prediction-success"
              role="status"
              aria-live="polite"
            >
              <FiCheckCircle size={14} aria-hidden="true" />
              ¡Vaticinio guardado!
            </p>
          )}

          {/* Actions: only show when the window is still open */}
          {!isClosed && !isFinished && !isInProgress && (
            <div className="prediction-form__actions">
              <button
                type="submit"
                className="btn-save"
                disabled={inputDisabled || !isDirty}
                aria-label={prediction ? 'Actualizar vaticinio' : 'Guardar vaticinio'}
              >
                {saving ? (
                  <span className="btn-spinner" aria-hidden="true" />
                ) : (
                  <FiSave size={15} aria-hidden="true" />
                )}
                <span>{saving ? 'Guardando…' : prediction ? 'Actualizar' : 'Guardar'}</span>
              </button>

              {prediction && (
                <button
                  type="button"
                  className="btn-delete"
                  onClick={handleDelete}
                  disabled={deleting || saving}
                  aria-label="Eliminar vaticinio"
                >
                  {deleting ? (
                    <span className="btn-spinner btn-spinner--sm" aria-hidden="true" />
                  ) : (
                    <FiTrash2 size={15} aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          )}

          {/* Show submitted prediction when window is closed or match is live/finished */}
          {(isClosed || isFinished || isInProgress) && prediction && !prediction.is_scored && (
            <p className="prediction-display" aria-label={`Tu pronóstico: ${prediction.predicted_home_score} - ${prediction.predicted_away_score}`}>
              Tu pronóstico:{' '}
              <strong>
                {prediction.predicted_home_score} — {prediction.predicted_away_score}
              </strong>
            </p>
          )}

          {/* No prediction submitted message */}
          {(isClosed || isFinished) && !prediction && (
            <p className="no-prediction" aria-label="No enviaste un vaticinio para este partido">
              Sin vaticinio registrado
            </p>
          )}
        </form>
      )}

      {isCancelled && (
        <p className="cancelled-notice" role="status">
          Este partido fue cancelado.
        </p>
      )}
    </article>
  );
};

export default MatchCard;

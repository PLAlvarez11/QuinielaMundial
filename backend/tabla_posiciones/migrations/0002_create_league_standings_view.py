# Generated migration for creating league_standings VIEW
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tabla_posiciones', '0001_initial'),
        ('prediction_engine', '0001_initial'),  # Ensure prediction table exists
        ('leagues_app', '0002_initial'),  # Ensure league members table exists
    ]

    operations = [
        migrations.RunSQL(
            # CREATE VIEW
            sql="""
            CREATE OR REPLACE VIEW league_standings AS
            WITH ranked_members AS (
                -- First, calculate all scores and rank
                SELECT
                    lm.league_id,
                    lm.id AS league_member_id,
                    lm.user_id,
                    lm.team_name,
                    COALESCE(SUM(p.points), 0) AS total_points,
                    COALESCE(COUNT(p.id) FILTER (WHERE p.is_scored = true), 0) AS scored_predictions,
                    COALESCE(COUNT(p.id) FILTER (WHERE p.points IS NOT NULL), 0) AS total_predictions,
                    COALESCE(
                        ROUND(
                            (COUNT(p.id) FILTER (WHERE p.points IS NOT NULL AND p.points = 3)::NUMERIC / 
                             NULLIF(COUNT(p.id) FILTER (WHERE p.is_scored = true), 0)) * 100,
                            2
                        ),
                        0
                    ) AS exact_score_percentage,
                    COALESCE(
                        COUNT(p.id) FILTER (WHERE p.points >= 1),
                        0
                    ) AS correct_predictions,
                    lm.joined_at,
                    lm.updated_at AS last_updated,
                    -- Single DENSE_RANK without nesting
                    DENSE_RANK() OVER (
                        PARTITION BY lm.league_id
                        ORDER BY COALESCE(SUM(p.points), 0) DESC,
                                 COALESCE(COUNT(p.id) FILTER (WHERE p.points = 3), 0) DESC,
                                 lm.joined_at ASC
                    ) AS rank
                FROM
                    leagues_app_leaguemember lm
                LEFT JOIN
                    prediction_engine_prediction p ON (
                        p.league_id = lm.league_id
                        AND p.user_id = lm.user_id
                        AND p.is_scored = true
                    )
                WHERE
                    lm.status = 'active'
                GROUP BY
                    lm.league_id,
                    lm.id,
                    lm.user_id,
                    lm.team_name,
                    lm.joined_at,
                    lm.updated_at
            )
            SELECT
                league_id,
                league_member_id,
                user_id,
                team_name,
                total_points,
                scored_predictions,
                total_predictions,
                exact_score_percentage,
                correct_predictions,
                rank,
                joined_at,
                last_updated,
                CURRENT_TIMESTAMP AS view_timestamp
            FROM
                ranked_members
            ORDER BY
                league_id,
                rank;
            """,
            # ROLLBACK
            reverse_sql="""DROP VIEW IF EXISTS league_standings CASCADE;"""
        ),
        
        # Create indexes for performance
        migrations.RunSQL(
            sql="""
            CREATE INDEX IF NOT EXISTS idx_league_standings_league_id 
            ON leagues_app_leaguemember(league_id) 
            WHERE status = 'active';
            """,
            reverse_sql="""DROP INDEX IF EXISTS idx_league_standings_league_id;"""
        ),
        
        migrations.RunSQL(
            sql="""
            CREATE INDEX IF NOT EXISTS idx_predictions_league_user_scored 
            ON prediction_engine_prediction(league_id, user_id, is_scored) 
            WHERE is_scored = true;
            """,
            reverse_sql="""DROP INDEX IF EXISTS idx_predictions_league_user_scored;"""
        ),
        
        migrations.RunSQL(
            sql="""
            CREATE INDEX IF NOT EXISTS idx_predictions_user_league_match 
            ON prediction_engine_prediction(user_id, league_id, match_id);
            """,
            reverse_sql="""DROP INDEX IF EXISTS idx_predictions_user_league_match;"""
        ),
        
        # Composite index for fast lookups
        migrations.RunSQL(
            sql="""
            CREATE INDEX IF NOT EXISTS idx_predictions_scoring 
            ON prediction_engine_prediction(league_id, is_scored, points) 
            WHERE is_scored = true AND points IS NOT NULL;
            """,
            reverse_sql="""DROP INDEX IF EXISTS idx_predictions_scoring;"""
        ),
    ]

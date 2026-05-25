"""
Migration: audit_log table + database triggers.

Creates the audit_log table and attaches AFTER INSERT / UPDATE / DELETE
triggers to the four tables that require change history:
  - users         (users app)
  - leagues_app_league  (leagues_app)
  - predictions   (prediction_engine)
  - matches       (catalogo)

DATABASE SUPPORT
----------------
SQLite  — triggers are implemented using SQLite syntax (current dev DB).
PostgreSQL — triggers use a single PL/pgSQL function + one trigger per table
             (ready for the production migration).

Each RunPython operation detects the current DB vendor and applies the
appropriate SQL, so the same migration file works in both environments.
"""

from django.db import migrations


# ---------------------------------------------------------------------------
# SQL: audit_log table
# ---------------------------------------------------------------------------

SQLITE_CREATE_AUDIT_TABLE = """
CREATE TABLE IF NOT EXISTS "audit_log" (
    "id"         INTEGER PRIMARY KEY AUTOINCREMENT,
    "table_name" VARCHAR(100) NOT NULL,
    "operation"  VARCHAR(10)  NOT NULL,
    "record_id"  TEXT         NOT NULL,
    "changed_at" DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "old_data"   TEXT,
    "new_data"   TEXT
);
"""

POSTGRESQL_CREATE_AUDIT_TABLE = """
CREATE TABLE IF NOT EXISTS audit_log (
    id          BIGSERIAL    PRIMARY KEY,
    table_name  VARCHAR(100) NOT NULL,
    operation   VARCHAR(10)  NOT NULL,
    record_id   TEXT         NOT NULL,
    changed_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    old_data    TEXT,
    new_data    TEXT
);
"""

# ---------------------------------------------------------------------------
# SQL: SQLite triggers (one per operation per table)
# Each statement must be executed individually — sqlite3 does not support
# executing multiple statements separated by semicolons in a single execute().
# ---------------------------------------------------------------------------

SQLITE_TRIGGERS = {
    # ── predictions ─────────────────────────────────────────────────────
    'trg_predictions_insert': """
        CREATE TRIGGER IF NOT EXISTS trg_predictions_after_insert
        AFTER INSERT ON predictions
        BEGIN
            INSERT INTO audit_log (table_name, operation, record_id, changed_at)
            VALUES ('predictions', 'INSERT', NEW.id, CURRENT_TIMESTAMP);
        END
    """,
    'trg_predictions_update': """
        CREATE TRIGGER IF NOT EXISTS trg_predictions_after_update
        AFTER UPDATE ON predictions
        BEGIN
            INSERT INTO audit_log (table_name, operation, record_id, changed_at)
            VALUES ('predictions', 'UPDATE', NEW.id, CURRENT_TIMESTAMP);
        END
    """,
    'trg_predictions_delete': """
        CREATE TRIGGER IF NOT EXISTS trg_predictions_after_delete
        AFTER DELETE ON predictions
        BEGIN
            INSERT INTO audit_log (table_name, operation, record_id, changed_at)
            VALUES ('predictions', 'DELETE', OLD.id, CURRENT_TIMESTAMP);
        END
    """,

    # ── users ────────────────────────────────────────────────────────────
    'trg_users_insert': """
        CREATE TRIGGER IF NOT EXISTS trg_users_after_insert
        AFTER INSERT ON users
        BEGIN
            INSERT INTO audit_log (table_name, operation, record_id, changed_at)
            VALUES ('users', 'INSERT', NEW.id, CURRENT_TIMESTAMP);
        END
    """,
    'trg_users_update': """
        CREATE TRIGGER IF NOT EXISTS trg_users_after_update
        AFTER UPDATE ON users
        BEGIN
            INSERT INTO audit_log (table_name, operation, record_id, changed_at)
            VALUES ('users', 'UPDATE', NEW.id, CURRENT_TIMESTAMP);
        END
    """,
    'trg_users_delete': """
        CREATE TRIGGER IF NOT EXISTS trg_users_after_delete
        AFTER DELETE ON users
        BEGIN
            INSERT INTO audit_log (table_name, operation, record_id, changed_at)
            VALUES ('users', 'DELETE', OLD.id, CURRENT_TIMESTAMP);
        END
    """,

    # ── leagues (leagues_app_league) ─────────────────────────────────────
    'trg_leagues_insert': """
        CREATE TRIGGER IF NOT EXISTS trg_leagues_after_insert
        AFTER INSERT ON leagues_app_league
        BEGIN
            INSERT INTO audit_log (table_name, operation, record_id, changed_at)
            VALUES ('leagues_app_league', 'INSERT', NEW.id, CURRENT_TIMESTAMP);
        END
    """,
    'trg_leagues_update': """
        CREATE TRIGGER IF NOT EXISTS trg_leagues_after_update
        AFTER UPDATE ON leagues_app_league
        BEGIN
            INSERT INTO audit_log (table_name, operation, record_id, changed_at)
            VALUES ('leagues_app_league', 'UPDATE', NEW.id, CURRENT_TIMESTAMP);
        END
    """,
    'trg_leagues_delete': """
        CREATE TRIGGER IF NOT EXISTS trg_leagues_after_delete
        AFTER DELETE ON leagues_app_league
        BEGIN
            INSERT INTO audit_log (table_name, operation, record_id, changed_at)
            VALUES ('leagues_app_league', 'DELETE', OLD.id, CURRENT_TIMESTAMP);
        END
    """,

    # ── matches (catalogo) ───────────────────────────────────────────────
    'trg_matches_insert': """
        CREATE TRIGGER IF NOT EXISTS trg_matches_after_insert
        AFTER INSERT ON matches
        BEGIN
            INSERT INTO audit_log (table_name, operation, record_id, changed_at)
            VALUES ('matches', 'INSERT', NEW.id, CURRENT_TIMESTAMP);
        END
    """,
    'trg_matches_update': """
        CREATE TRIGGER IF NOT EXISTS trg_matches_after_update
        AFTER UPDATE ON matches
        BEGIN
            INSERT INTO audit_log (table_name, operation, record_id, changed_at)
            VALUES ('matches', 'UPDATE', NEW.id, CURRENT_TIMESTAMP);
        END
    """,
    'trg_matches_delete': """
        CREATE TRIGGER IF NOT EXISTS trg_matches_after_delete
        AFTER DELETE ON matches
        BEGIN
            INSERT INTO audit_log (table_name, operation, record_id, changed_at)
            VALUES ('matches', 'DELETE', OLD.id, CURRENT_TIMESTAMP);
        END
    """,
}

# ---------------------------------------------------------------------------
# SQL: PostgreSQL — single reusable function + one trigger per table
# ---------------------------------------------------------------------------

POSTGRESQL_AUDIT_FUNCTION = """
CREATE OR REPLACE FUNCTION fn_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (table_name, operation, record_id, changed_at, old_data)
        VALUES (TG_TABLE_NAME, TG_OP, OLD.id::TEXT, NOW(), row_to_json(OLD)::TEXT);
        RETURN OLD;
    ELSE
        INSERT INTO audit_log (table_name, operation, record_id, changed_at, new_data)
        VALUES (TG_TABLE_NAME, TG_OP, NEW.id::TEXT, NOW(), row_to_json(NEW)::TEXT);
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;
"""

# Tables that receive the PostgreSQL trigger
POSTGRESQL_TRIGGER_TABLES = [
    'predictions',
    'users',
    'leagues_app_league',
    'matches',
]


def _postgresql_trigger_sql(table: str) -> str:
    trigger_name = f'trg_{table.replace("leagues_app_", "")}_audit'
    return f"""
        CREATE TRIGGER {trigger_name}
        AFTER INSERT OR UPDATE OR DELETE ON {table}
        FOR EACH ROW EXECUTE FUNCTION fn_audit_log();
    """


# ---------------------------------------------------------------------------
# Drop statements (for migration reversal)
# ---------------------------------------------------------------------------

SQLITE_DROP_TRIGGERS = [
    'DROP TRIGGER IF EXISTS trg_predictions_after_insert',
    'DROP TRIGGER IF EXISTS trg_predictions_after_update',
    'DROP TRIGGER IF EXISTS trg_predictions_after_delete',
    'DROP TRIGGER IF EXISTS trg_users_after_insert',
    'DROP TRIGGER IF EXISTS trg_users_after_update',
    'DROP TRIGGER IF EXISTS trg_users_after_delete',
    'DROP TRIGGER IF EXISTS trg_leagues_after_insert',
    'DROP TRIGGER IF EXISTS trg_leagues_after_update',
    'DROP TRIGGER IF EXISTS trg_leagues_after_delete',
    'DROP TRIGGER IF EXISTS trg_matches_after_insert',
    'DROP TRIGGER IF EXISTS trg_matches_after_update',
    'DROP TRIGGER IF EXISTS trg_matches_after_delete',
]

POSTGRESQL_DROP_TRIGGERS = [
    f"DROP TRIGGER IF EXISTS trg_{t.replace('leagues_app_', '')}_audit ON {t}"
    for t in POSTGRESQL_TRIGGER_TABLES
]
POSTGRESQL_DROP_FUNCTION = 'DROP FUNCTION IF EXISTS fn_audit_log()'
POSTGRESQL_DROP_AUDIT_TABLE = 'DROP TABLE IF EXISTS audit_log'

SQLITE_DROP_AUDIT_TABLE = 'DROP TABLE IF EXISTS audit_log'


# ---------------------------------------------------------------------------
# RunPython callables
# ---------------------------------------------------------------------------

def apply_audit(apps, schema_editor):
    vendor = schema_editor.connection.vendor  # 'sqlite' or 'postgresql'

    with schema_editor.connection.cursor() as cursor:
        if vendor == 'sqlite':
            cursor.execute(SQLITE_CREATE_AUDIT_TABLE)
            for sql in SQLITE_TRIGGERS.values():
                cursor.execute(sql)

        elif vendor == 'postgresql':
            cursor.execute(POSTGRESQL_CREATE_AUDIT_TABLE)
            cursor.execute(POSTGRESQL_AUDIT_FUNCTION)
            for table in POSTGRESQL_TRIGGER_TABLES:
                cursor.execute(_postgresql_trigger_sql(table))

        else:
            raise RuntimeError(
                f"Unsupported database vendor '{vendor}'. "
                "Only 'sqlite' and 'postgresql' are supported by this migration."
            )


def reverse_audit(apps, schema_editor):
    vendor = schema_editor.connection.vendor

    with schema_editor.connection.cursor() as cursor:
        if vendor == 'sqlite':
            for sql in SQLITE_DROP_TRIGGERS:
                cursor.execute(sql)
            cursor.execute(SQLITE_DROP_AUDIT_TABLE)

        elif vendor == 'postgresql':
            for sql in POSTGRESQL_DROP_TRIGGERS:
                cursor.execute(sql)
            cursor.execute(POSTGRESQL_DROP_FUNCTION)
            cursor.execute(POSTGRESQL_DROP_AUDIT_TABLE)


# ---------------------------------------------------------------------------
# Migration
# ---------------------------------------------------------------------------

class Migration(migrations.Migration):

    dependencies = [
        ('prediction_engine', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(apply_audit, reverse_code=reverse_audit),
    ]

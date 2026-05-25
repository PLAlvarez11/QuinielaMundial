from django.apps import AppConfig


class TablaPosicionesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'tabla_posiciones'
    verbose_name = 'M4 — Tabla de Posiciones'
    
    def ready(self):
        """Connect signals when app is ready."""
        import tabla_posiciones.signals  # noqa
        print("[APP] tabla_posiciones app ready - signals connected")

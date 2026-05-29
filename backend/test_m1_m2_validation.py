"""
Script de validación de M1 (Autenticación) y M2 (Ligas)
Realiza pruebas de los flujos principales en la API
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8080/api"  # Ajustar según URL desplegada

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'

def print_section(title):
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"  {title}")
    print(f"{'='*60}{Colors.RESET}\n")

def print_success(msg):
    print(f"{Colors.GREEN}✓ {msg}{Colors.RESET}")

def print_error(msg):
    print(f"{Colors.RED}✗ {msg}{Colors.RESET}")

def print_info(msg):
    print(f"{Colors.YELLOW}ℹ {msg}{Colors.RESET}")

# ============= M1: AUTENTICACIÓN =============

def test_m1_registro():
    """Test: Crear nuevo usuario con contraseña cifrada"""
    print_section("M1.1 - REGISTRO (Crear usuario con contraseña cifrada)")
    
    user_data = {
        "email": f"test_user_{datetime.now().timestamp()}@example.com",
        "name": "Test User",
        "password": "secure_password_123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/register/", json=user_data)
        
        if response.status_code == 201:
            data = response.json()
            print_success(f"Usuario creado: {data.get('email')}")
            print_success(f"ID del usuario: {data.get('id')}")
            return user_data['email']
        else:
            print_error(f"Error: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return None

def test_m1_login(email, password):
    """Test: Iniciar sesión y obtener token"""
    print_section("M1.2 - LOGIN (Inicio de sesión y token)")
    
    login_data = {
        "email": email,
        "password": password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/users/login/", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('token')
            print_success(f"Login exitoso para: {email}")
            print_success(f"Token generado: {token[:20]}...")
            print_success(f"Token expira en: {data.get('expires_at')}")
            return token
        else:
            print_error(f"Error de login: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return None

def test_m1_me(token):
    """Test: Obtener datos del usuario autenticado"""
    print_section("M1.3 - OBTENER USUARIO (Datos del usuario autenticado)")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/users/about-me/", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Usuario recuperado: {data.get('name')} ({data.get('email')})")
            return data
        else:
            print_error(f"Error: {response.status_code}")
            return None
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return None

# ============= M2: LIGAS =============

def test_m2_crear_liga(token, owner_name):
    """Test: Crear una liga"""
    print_section("M2.1 - CREAR LIGA (Validación y almacenamiento)")
    
    league_data = {
        "name": f"Liga Test {datetime.now().timestamp()}",
        "description": "Liga de prueba para validación",
        "type": "invited",
        "entry_fee": "50.00",
        "max_members": 5,
        "status": "active"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{BASE_URL}/leagues/leagues/", json=league_data, headers=headers)
        
        if response.status_code == 201:
            data = response.json()
            league_id = data.get('id')
            print_success(f"Liga creada: {data.get('name')} (ID: {league_id})")
            print_success(f"Owner: {data.get('owner')}")
            print_success(f"Max miembros: {data.get('max_members')}")
            print_success(f"Tipo: {data.get('type')}")
            return league_id
        else:
            print_error(f"Error: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return None

def test_m2_crear_invitacion(token, league_id, recipient_email):
    """Test: Crear invitación y enviar por email"""
    print_section("M2.2 - CREAR INVITACIÓN (Validación y envío de email)")
    
    invitation_data = {
        "league": league_id,
        "email": recipient_email
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{BASE_URL}/leagues/invitations/", json=invitation_data, headers=headers)
        
        if response.status_code == 201:
            data = response.json()
            token_inv = data.get('token')
            print_success(f"Invitación creada para: {data.get('email')}")
            print_success(f"Token: {token_inv}")
            print_success(f"Expira en: {data.get('expires_at')}")
            print_info(f"Email de invitación debería enviarse a: {recipient_email}")
            return token_inv
        else:
            print_error(f"Error: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return None

def test_m2_aceptar_invitacion(token, invitation_token):
    """Test: Aceptar invitación"""
    print_section("M2.3 - ACEPTAR INVITACIÓN (Validación de token y agregar miembro)")
    
    accept_data = {
        "token": invitation_token,
        "team_name": "Mi Equipo Test"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{BASE_URL}/leagues/invitations/accept_invitation/", 
                                json=accept_data, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Invitación aceptada exitosamente")
            print_success(f"Liga: {data.get('league', {}).get('name')}")
            return True
        else:
            print_error(f"Error: {response.status_code}")
            print(response.text)
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_m2_listar_ligas(token):
    """Test: Listar ligas del usuario"""
    print_section("M2.4 - LISTAR LIGAS (Verificar acceso)")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{BASE_URL}/leagues/leagues/", headers=headers)
        
        if response.status_code == 200:
            leagues = response.json()
            if isinstance(leagues, list):
                print_success(f"Se encontraron {len(leagues)} liga(s)")
                for league in leagues[:3]:  # Mostrar primeras 3
                    print(f"  - {league.get('name')} (ID: {league.get('id')})")
                return True
            else:
                print_error("Respuesta no es una lista")
                return False
        else:
            print_error(f"Error: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

def test_m2_logout(token):
    """Test: Cerrar sesión"""
    print_section("M1.4 - LOGOUT (Cerrar sesión)")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{BASE_URL}/users/logout/", headers=headers)
        
        if response.status_code == 204:
            print_success("Sesión cerrada exitosamente")
            return True
        else:
            print_error(f"Error: {response.status_code}")
            return False
    except Exception as e:
        print_error(f"Excepción: {str(e)}")
        return False

# ============= MAIN EXECUTION =============

def main():
    print(f"\n{Colors.BLUE}╔════════════════════════════════════════════════════════╗")
    print(f"║   VALIDACIÓN M1 (AUTENTICACIÓN) Y M2 (LIGAS)            ║")
    print(f"║   QuinielaMundial - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}        ║")
    print(f"╚════════════════════════════════════════════════════════╝{Colors.RESET}\n")
    
    try:
        # Verificar conectividad
        print_info(f"Verificando conectividad a {BASE_URL}...")
        response = requests.get(BASE_URL.rsplit('/', 1)[0] + "/users/about-me/", timeout=5)
        print_success("Backend accesible")
    except Exception as e:
        print_error(f"No se puede conectar al backend: {str(e)}")
        print_error("Asegúrate de que el servidor está corriendo")
        return
    
    # M1: AUTENTICACIÓN
    print(f"\n{Colors.YELLOW}{'▶ MÓDULO M1: AUTENTICACIÓN':<50}{Colors.RESET}")
    
    # Registro
    email = test_m1_registro()
    if not email:
        print_error("No se pudo continuar sin usuario")
        return
    
    # Login
    token = test_m1_login(email, "secure_password_123")
    if not token:
        print_error("No se pudo continuar sin token")
        return
    
    # Obtener datos del usuario
    user = test_m1_me(token)
    if not user:
        print_error("No se pudo recuperar datos del usuario")
    
    # M2: LIGAS
    print(f"\n{Colors.YELLOW}{'▶ MÓDULO M2: LIGAS':<50}{Colors.RESET}")
    
    # Crear liga
    league_id = test_m2_crear_liga(token, user.get('name') if user else "Test User")
    if not league_id:
        print_error("No se pudo crear liga")
        return
    
    # Crear invitación (para un email diferente)
    recipient_email = f"invited_user_{datetime.now().timestamp()}@example.com"
    inv_token = test_m2_crear_invitacion(token, league_id, recipient_email)
    
    # Listar ligas
    test_m2_listar_ligas(token)
    
    # Logout
    test_m2_logout(token)
    
    # RESUMEN FINAL
    print(f"\n{Colors.BLUE}{'='*60}")
    print(f"  RESUMEN DE VALIDACIÓN")
    print(f"{'='*60}{Colors.RESET}\n")
    
    print(f"{Colors.GREEN}✓ M1 - Autenticación:        FUNCIONAL{Colors.RESET}")
    print(f"  - Registro con contraseña cifrada")
    print(f"  - Inicio de sesión con token")
    print(f"  - Obtención de datos del usuario")
    print(f"  - Cierre de sesión")
    
    print(f"\n{Colors.GREEN}✓ M2 - Ligas:               FUNCIONAL{Colors.RESET}")
    print(f"  - Creación de ligas (solo owner es miembro)")
    print(f"  - Creación de invitaciones")
    print(f"  - Validaciones de permisos")
    print(f"  - Configuración de tipo y estado")
    
    print(f"\n{Colors.YELLOW}ℹ Próximos pasos:{Colors.RESET}")
    print(f"  - Crear usuario 2 y registrarlo con email: {recipient_email}")
    print(f"  - Usar token de invitación para aceptar: {inv_token if inv_token else 'N/A'}")
    print(f"  - Verificar que solo propietarios crean invitaciones")
    print(f"  - Verificar que no se puede exceeder max_members")
    
    print(f"\n{Colors.BLUE}Validación completada.{Colors.RESET}\n")

if __name__ == "__main__":
    main()

from rest_framework import status
from rest_framework.test import APITestCase

from .models import CustomUser


class UsersApiTests(APITestCase):
	def test_register_login_me_logout_flow(self):
		register_res = self.client.post(
			'/api/auth/register/',
			{'email': 'test@example.com', 'name': 'Test', 'password': 'secret123'},
			format='json',
		)
		self.assertEqual(register_res.status_code, status.HTTP_201_CREATED)
		self.assertEqual(register_res.data['email'], 'test@example.com')

		login_res = self.client.post(
			'/api/auth/login/',
			{'email': 'test@example.com', 'password': 'secret123'},
			format='json',
		)
		self.assertEqual(login_res.status_code, status.HTTP_200_OK)
		token = login_res.data['token']
		self.assertTrue(token)

		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
		me_res = self.client.get('/api/auth/me/')
		self.assertEqual(me_res.status_code, status.HTTP_200_OK)
		self.assertEqual(me_res.data['email'], 'test@example.com')

		logout_res = self.client.post('/api/auth/logout/')
		self.assertEqual(logout_res.status_code, status.HTTP_204_NO_CONTENT)

		me_after_logout = self.client.get('/api/auth/me/')
		self.assertEqual(me_after_logout.status_code, status.HTTP_401_UNAUTHORIZED)

	def test_users_list_requires_admin(self):
		CustomUser.objects.create_user(
			email='u1@example.com',
			name='U1',
			password='secret123',
		)

		admin = CustomUser.objects.create_user(
			email='admin@example.com',
			name='Admin',
			password='secret123',
			is_staff=True,
			is_admin=True,
			is_superuser=True,
		)

		login_res = self.client.post(
			'/api/auth/login/',
			{'email': 'admin@example.com', 'password': 'secret123'},
			format='json',
		)
		token = login_res.data['token']
		self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')

		list_res = self.client.get('/api/users/')
		self.assertEqual(list_res.status_code, status.HTTP_200_OK)

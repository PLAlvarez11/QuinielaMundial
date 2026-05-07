from django.utils import timezone
from rest_framework import serializers

from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            'id',
            'email',
            'name',
            'avatar_url',
            'is_admin',
            'is_staff',
            'created_at',
            'updated_at',
        ]
        read_only_fields = [
            'id',
            'is_admin',
            'is_staff',
            'created_at',
            'updated_at',
        ]


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    name = serializers.CharField(max_length=100)
    password = serializers.CharField(min_length=6, write_only=True)

    def validate_email(self, value: str) -> str:
        email = value.strip().lower()
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError('El email ya está registrado.')
        return email

    def create(self, validated_data):
        return CustomUser.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs['email'].strip().lower()
        password = attrs['password']

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('Credenciales inválidas.')

        if user.deleted_at is not None:
            raise serializers.ValidationError('Usuario deshabilitado.')

        if not user.check_password(password):
            raise serializers.ValidationError('Credenciales inválidas.')

        attrs['user'] = user
        return attrs


class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(min_length=6, write_only=True, required=False)

    class Meta:
        model = CustomUser
        fields = ['name', 'avatar_url', 'password']

    def update(self, instance: CustomUser, validated_data):
        password = validated_data.pop('password', None)
        for key, value in validated_data.items():
            setattr(instance, key, value)

        if password:
            instance.set_password(password)

        instance.updated_at = timezone.now()
        instance.save()
        return instance


class AdminCreateUserSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    name = serializers.CharField(max_length=100)
    password = serializers.CharField(min_length=6, write_only=True)
    avatar_url = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    is_admin = serializers.BooleanField(required=False, default=False)
    is_staff = serializers.BooleanField(required=False, default=False)

    def validate_email(self, value: str) -> str:
        email = value.strip().lower()
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError('El email ya está registrado.')
        return email

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser.objects.create_user(password=password, **validated_data)
        return user

from rest_framework import serializers
from .models import PrizeDistribution


class PrizeDistributionSerializer(serializers.ModelSerializer):
    league_name = serializers.CharField(source='league.name', read_only=True)
    member_team_name = serializers.CharField(source='member.team_name', read_only=True)

    class Meta:
        model = PrizeDistribution
        fields = '__all__'

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                'El monto del premio debe ser mayor a 0.'
            )
        return value

    def validate(self, data):
        league = data.get('league')
        member = data.get('member')

        if league and member and member.league_id != league.id:
            raise serializers.ValidationError(
                'El miembro seleccionado no pertenece a la liga indicada.'
            )

        return data
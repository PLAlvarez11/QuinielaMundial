from rest_framework import serializers
from .models import (
    Venue,
    Stadium,
    Country,
    TournamentStage,
    Group,
    GroupCountry,
    Match
)


class VenueSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venue
        fields = '__all__'


class StadiumSerializer(serializers.ModelSerializer):
    venue_name = serializers.CharField(source='venue.name', read_only=True)

    class Meta:
        model = Stadium
        fields = '__all__'


class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'


class TournamentStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TournamentStage
        fields = '__all__'


class GroupSerializer(serializers.ModelSerializer):
    stage_name = serializers.CharField(source='stage.name', read_only=True)

    class Meta:
        model = Group
        fields = '__all__'


class GroupCountrySerializer(serializers.ModelSerializer):
    group_name = serializers.CharField(source='group.name', read_only=True)
    country_name = serializers.CharField(source='country.name', read_only=True)

    class Meta:
        model = GroupCountry
        fields = '__all__'


class MatchSerializer(serializers.ModelSerializer):
    home_team_name = serializers.CharField(source='home_team.name', read_only=True)
    away_team_name = serializers.CharField(source='away_team.name', read_only=True)
    stadium_name = serializers.CharField(source='stadium.name', read_only=True)
    stage_name = serializers.CharField(source='stage.name', read_only=True)
    group_name = serializers.CharField(source='group.name', read_only=True)

    class Meta:
        model = Match
        fields = '__all__'

    def validate(self, data):
        home_team = data.get('home_team')
        away_team = data.get('away_team')

        if home_team and away_team and home_team == away_team:
            raise serializers.ValidationError(
                'El equipo local y visitante no pueden ser el mismo.'
            )

        return data
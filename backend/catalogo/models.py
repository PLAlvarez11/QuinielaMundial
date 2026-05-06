from django.db import models


class Venue(models.Model):
    name = models.CharField(max_length=150)
    city = models.CharField(max_length=150)
    country = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'venues'
        ordering = ['name']

    def __str__(self):
        return f'{self.name} - {self.city}'


class Stadium(models.Model):
    name = models.CharField(max_length=150)
    venue = models.ForeignKey(
        Venue,
        on_delete=models.PROTECT,
        related_name='stadiums'
    )
    capacity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'stadiums'
        ordering = ['name']

    def __str__(self):
        return self.name


class Country(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=5, unique=True)
    flag_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'countries'
        ordering = ['name']

    def __str__(self):
        return self.name


class TournamentStage(models.Model):
    name = models.CharField(max_length=100)
    order = models.PositiveIntegerField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tournament_stages'
        ordering = ['order']

    def __str__(self):
        return self.name


class Group(models.Model):
    name = models.CharField(max_length=20)
    stage = models.ForeignKey(
        TournamentStage,
        on_delete=models.PROTECT,
        related_name='groups'
    )
    countries = models.ManyToManyField(
        Country,
        through='GroupCountry',
        related_name='groups'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'groups'
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(
                fields=['name', 'stage'],
                name='unique_group_by_stage'
            )
        ]

    def __str__(self):
        return f'Grupo {self.name}'


class GroupCountry(models.Model):
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='group_countries'
    )
    country = models.ForeignKey(
        Country,
        on_delete=models.PROTECT,
        related_name='group_countries'
    )

    class Meta:
        db_table = 'group_countries'
        constraints = [
            models.UniqueConstraint(
                fields=['group', 'country'],
                name='unique_country_by_group'
            )
        ]

    def __str__(self):
        return f'{self.group} - {self.country}'


class Match(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Programado'),
        ('in_progress', 'En curso'),
        ('finished', 'Finalizado'),
        ('cancelled', 'Cancelado'),
    ]

    home_team = models.ForeignKey(
        Country,
        on_delete=models.PROTECT,
        related_name='home_matches'
    )
    away_team = models.ForeignKey(
        Country,
        on_delete=models.PROTECT,
        related_name='away_matches'
    )
    stadium = models.ForeignKey(
        Stadium,
        on_delete=models.PROTECT,
        related_name='matches'
    )
    stage = models.ForeignKey(
        TournamentStage,
        on_delete=models.PROTECT,
        related_name='matches'
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.PROTECT,
        related_name='matches',
        blank=True,
        null=True
    )

    match_date = models.DateTimeField()
    home_score = models.PositiveIntegerField(blank=True, null=True)
    away_score = models.PositiveIntegerField(blank=True, null=True)
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'matches'
        ordering = ['match_date']

    def __str__(self):
        return f'{self.home_team} vs {self.away_team}'
from django.db import models


class PrizeDistribution(models.Model):
    POSITION_CHOICES = [
        ('first', 'Primer lugar'),
        ('second', 'Segundo lugar'),
        ('third', 'Tercer lugar'),
        ('last', 'Último lugar'),
        ('global_individual', 'Premio global individual'),
        ('global_league', 'Premio global por liga'),
    ]

    TYPE_CHOICES = [
        ('league', 'Premio de liga'),
        ('global', 'Premio global'),
        ('tie', 'Premio por empate'),
    ]

    league = models.ForeignKey(
        'leagues_app.League',
        on_delete=models.PROTECT,
        related_name='prize_distributions'
    )

    member = models.ForeignKey(
        'leagues_app.LeagueMember',
        on_delete=models.PROTECT,
        related_name='prize_distributions'
    )

    position = models.CharField(
        max_length=30,
        choices=POSITION_CHOICES
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
        default='league'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'prize_distributions'
        ordering = ['league', 'position', '-amount']

    def __str__(self):
        return f'{self.league} - {self.member} - {self.amount}'
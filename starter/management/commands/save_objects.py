from django.core.management import BaseCommand


class Command(BaseCommand):

    def handle(self, *args, **options):
        from django.contrib.contenttypes.models import ContentType
        ContentType.objects.all().delete()

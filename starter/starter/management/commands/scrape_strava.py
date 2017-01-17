from django.core.management import BaseCommand
from stravalib.client import Client

from starter.models import AuthToken, StravaActivity, Event, Tag


class Command(BaseCommand):
    def handle(self, *args, **options):
        for token in AuthToken.objects.filter(type=AuthToken.Type.STRAVA.value).all():
            self._process_token(token)

    def _process_token(self, auth_token: AuthToken):
        client = Client()
        client.access_token = auth_token.token
        athlete = client.get_athlete()
        user = auth_token.user

        try:
            tag = Tag.objects.get(owner_id=user.id, name__iexact="Strava")
        except Tag.DoesNotExist:
            # Create the Strava tag
            tag = Tag.objects.create(
                name="Strava",
                owner_id=user.id,
            )

        # TODO: Fetch the latest imported activity for this user, then start the fetch from there.

        for activity in client.get_activities():
            assert activity.athlete.id == athlete.id, "Got activity for wrong athlete"
            try:
                stored_activity = StravaActivity.objects.get(strava_id=activity.id)
            except StravaActivity.DoesNotExist:
                # Save the activity
                print("Saving", activity)
                event = Event.objects.create(
                    name=activity.name,
                    start_time=activity.start_date,
                    duration_secs=activity.elapsed_time.total_seconds(),
                    author=user,
                    owner=user,
                )
                event.create_local_id(user)
                event.set_tags([tag])

                StravaActivity.objects.create(
                    strava_id=activity.id,
                    athlete=athlete.id,
                    importer_id=user.id,
                    event_id=event.id,
                    moving_time=activity.moving_time.total_seconds(),
                    elapsed_time=activity.elapsed_time.total_seconds(),
                    distance=activity.distance,
                    start_date=activity.start_date,
                )
            else:
                # TODO: Consider updating the data on the activity in case it changed.. probably not
                # worth it though.
                pass

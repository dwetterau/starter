from typing import Any, Dict

from django.contrib.auth.models import User


def user_to_dict(user: User) -> Dict[str, Any]:
    return dict(
        id=user.id,
        firstName=user.first_name,
        lastName=user.last_name,
        email=user.email,
        username=user.username
    )

def user_to_dict(user):
    return dict(
        id=user.id,
        firstName=user.first_name,
        lastName=user.last_name,
        email=user.email,
        username=user.username
    )

import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required(login_url=u'/auth/login')
def index(request):
    props = json.dumps(dict(prop1=request.user.id, prop2="logged in!"))
    return render(request, 'starter/index.html', dict(props=props))


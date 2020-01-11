from rest_framework import viewsets, permissions
from rest_framework_nested.viewsets import NestedViewSetMixin

from .serializers import ProjectSerializer, TasksSerializer, UserSerializer
from .models import Project as ProjectModel, Task as TaskModel
from django.contrib.auth import get_user_model

UserModel = get_user_model()


class ProjectViewset(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = ProjectModel.objects.all()


class TasksViewset(NestedViewSetMixin, viewsets.ModelViewSet):
    serializer_class = TasksSerializer
    queryset = TaskModel.objects.all()


class UserViewset(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = UserModel.objects.all()

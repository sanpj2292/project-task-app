from rest_framework import viewsets, permissions
from rest_framework_nested.viewsets import NestedViewSetMixin

from .serializers import ProjectSerializer, TasksSerializer
from .models import Project as ProjectModel, Task as TaskModel


class ProjectViewset(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    queryset = ProjectModel.objects.all()


class TasksViewset(NestedViewSetMixin, viewsets.ModelViewSet):
    serializer_class = TasksSerializer
    queryset = TaskModel.objects.all()

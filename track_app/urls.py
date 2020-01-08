from .views import ProjectViewset, TasksViewset
from rest_framework_nested.routers import NestedSimpleRouter, SimpleRouter
from django.urls import path, include

parent_router = SimpleRouter()

parent_router.register('project', ProjectViewset)

prj_router = NestedSimpleRouter(parent_router, r'project', lookup='project')
prj_router.register('task', TasksViewset, basename='project-tasks')

urlpatterns = [
    path('', include(parent_router.urls)),
    path('', include(prj_router.urls)),
]

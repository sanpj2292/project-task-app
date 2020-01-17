from .views import ProjectViewset, TasksViewset, UserViewset, get_image_data
from rest_framework_nested.routers import NestedSimpleRouter, SimpleRouter
from django.urls import path, include

parent_router = SimpleRouter()
user_router = SimpleRouter()

parent_router.register('project', ProjectViewset)
user_router.register('user', UserViewset)

prj_router = NestedSimpleRouter(parent_router, r'project', lookup='project')
prj_router.register('task', TasksViewset, basename='project-tasks')

urlpatterns = [
    path('', include(parent_router.urls)),
    path('', include(prj_router.urls)),
    path('', include(user_router.urls)),
    path('image/', get_image_data),
]

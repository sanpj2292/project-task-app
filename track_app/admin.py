from django.contrib import admin
from .models import Project as ProjectModel, Task as TaskModel
# Register your models here.

admin.site.register(ProjectModel)
admin.site.register(TaskModel)

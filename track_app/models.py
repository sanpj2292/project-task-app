
from django.db import models
from django.contrib.auth import get_user_model


UserModel = get_user_model()


class Project(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(max_length=2000, blank=True, null=True)
    start_date = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    duration = models.DurationField()

    def __str__(self):
        return f'Project<{self.name}>'

    class Meta:
        db_table = 'projects'


class Task(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(max_length=3000, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    created_by = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)

    def __str__(self):
        return f'Task<{self.name}>'

    class Meta:
        db_table = 'tasks'

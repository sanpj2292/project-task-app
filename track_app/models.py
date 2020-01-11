import sys
from PIL import Image
from io import BytesIO
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.db import models
from django.contrib.auth import get_user_model

from djreact import settings

UserModel = get_user_model()


class Project(models.Model):
    name = models.CharField(max_length=120)
    description = models.TextField(max_length=2000, blank=True, null=True)
    start_date = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(UserModel, on_delete=models.CASCADE)
    duration = models.DurationField()
    avatar = models.ImageField(upload_to='project_avatars', blank=True, null=True,
                               default='default.jpg')

    def __str__(self):
        return f'Project<{self.name}>'

    class Meta:
        db_table = 'projects'

    def save(self, *args, **kwargs):
        self.avatar = self.compressImage(self.avatar)
        super(Project, self).save(*args, **kwargs)

    def compressImage(self, uploadedImage):
        imageTemproary = Image.open(uploadedImage)
        outputIoStream = BytesIO()
        imageTemproaryResized = imageTemproary.resize(settings.PROJECT_AVATAR_SIZE)
        imageTemproaryResized.save(outputIoStream, format='JPEG', quality=85)
        outputIoStream.seek(0)
        uploadedImage = InMemoryUploadedFile(outputIoStream,
                                             'ImageField',
                                             f"{uploadedImage.name.split('.')[0]}.jpg",
                                             'image/jpeg',
                                             sys.getsizeof(outputIoStream),
                                             None)
        return uploadedImage


class Task(models.Model):
    name = models.CharField(max_length=150)
    description = models.TextField(max_length=3000, blank=True, null=True)
    start_date = models.DateField()
    end_date = models.DateField()
    created_by = models.ForeignKey(UserModel, on_delete=models.CASCADE,
                                   related_name='author')
    project_id = models.ForeignKey(Project, on_delete=models.CASCADE)
    assignee = models.ForeignKey(UserModel, on_delete=models.CASCADE, blank=True,
                                 null=True)

    def __str__(self):
        return f'Task<{self.name}>'

    class Meta:
        db_table = 'tasks'

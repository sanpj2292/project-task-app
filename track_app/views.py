from django.conf import settings
from django.http import HttpResponse
from rest_framework import viewsets, permissions
from rest_framework_nested.viewsets import NestedViewSetMixin

from .serializers import ProjectSerializer, TasksSerializer, UserSerializer
from .models import Project as ProjectModel, Task as TaskModel
from django.contrib.auth import get_user_model

from PIL import Image
import boto3

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


def get_image_data(request):
    try:
        s3 = boto3.client('s3', region_name=settings.AWS_S3_REGION_NAME,
                                 aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                 aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        if request.GET.get('fname'):
            img_file = s3.get_object(Bucket=settings.AWS_STORAGE_BUCKET_NAME,
                                     Key=f'media/project_avatars/{request.GET.get("fname")}')
            return HttpResponse(img_file['Body'].read(), content_type='image/jpeg')
        else:
            raise ValueError('Image Name is Empty or Invalid')
    except Exception as e:
        return HttpResponse(e, status=500)

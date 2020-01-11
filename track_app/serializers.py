from rest_framework import serializers
from .models import Project as ProjectModel, Task as TaskModel, UserModel
from djreact import settings


class ProjectSerializer(serializers.ModelSerializer):
    partial = True  # To support for Partial Updates to DB

    class Meta:
        model = ProjectModel
        fields = ('id', 'name', 'description', 'duration', 'created_by', 'task_set', 'avatar')
        read_only_fields = ('created_by', 'task_set')

    def create(self, validated_data):
        req = self.context['request']
        return ProjectModel.objects.create(**validated_data, created_by=req.user)


class TasksSerializer(serializers.ModelSerializer):
    parent_lookup_kwargs = {
        'project_pk': 'project_id__pk',
    }
    start_date = serializers.DateField(format=settings.DATE_FORMAT,
                                       input_formats=settings.DATE_INPUT_FORMATS)
    end_date = serializers.DateField(format=settings.DATE_FORMAT,
                                     input_formats=settings.DATE_INPUT_FORMATS)

    class Meta:
        model = TaskModel
        fields = ('id', 'name', 'description', 'start_date',
                  'end_date', 'project_id', 'created_by', 'assignee')
        read_only_fields = ('created_by',)

    def create(self, validated_data):
        req = self.context['request']
        return TaskModel.objects.create(**validated_data, created_by=req.user)


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserModel
        fields = ('id', 'username')
        read_only_fields = ('id', 'username')

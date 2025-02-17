"""
Learning models API views.
"""
from edx_rest_framework_extensions.auth.jwt.authentication import JwtAuthentication
from rest_framework.authentication import SessionAuthentication
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from uni_bot.api.client import UniBotLearningModelClient
from uni_bot.api.permissions import IsCustomInstructorWidgetRenderedInSeparateTab, IsStaffOrInstructor


class ModelsViewSet(ViewSet):
    """
    Provide endpoints for a course learning models.
    """

    authentication_classes = [SessionAuthentication, JwtAuthentication]
    permission_classes = [IsCustomInstructorWidgetRenderedInSeparateTab, IsStaffOrInstructor]

    def list(self, __, course_id: str) -> Response:  # pylint: disable=unused-argument
        """
        Provide available course learning models.

        **Example Request**

            GET /uni_bot/api/models/course-v1:OpenedX+DemoX+DemoCourse/

        **Response Values**

        If the request is successful, an HTTP 200 "OK" response is returned.

        **Example Response**

        ```json
        {
            "selected": [
                {
                    "label": "gpt-4o",
                    "value": "67a1d42a-ff37-4444-88c1-c1c57d21c1f2",
                    "data": {
                        "description": ""
                    }
                }
            ],
            "openai": [
                {
                    "label": "gpt-4o",
                    "value": "67a1d42a-ff37-4444-88c1-c1c57d21c1f2",
                    "data": {
                        "description": ""
                    }
                },
                {
                    "label": "gpt-4o-mini",
                    "value": "ff4a4e3d-3c54-4428-a1c4-dabcacb5bb2e",
                    "data": {
                        "description": ""
                    }
                },
                {
                    "label": "gpt-4",
                    "value": "4ab7fa9a-4452-4504-9fcb-6c3aff35bb72",
                    "data": {
                        "description": ""
                    }
                },
                {
                    "label": "gpt-3.5-turbo",
                    "value": "4d143798-f267-4e80-bb1b-829c805b0d81",
                    "data": {
                        "description": ""
                    }
                }
            ],
            "ollama": [],
            "watsonx": []
        }
        ```
        """
        redirection_response = UniBotLearningModelClient().list_learning_models(course_id)

        return Response(redirection_response.json(), status=redirection_response.status_code)

    def retrieve(self, __, course_id: str, uuid: str) -> Response:
        """
        Provide a course learning model details.

        **Example Request**

            GET /uni_bot/api/models/course-v1:OpenedX+DemoX+DemoCourse/67a1d42a-ff37-4444-88c1-c1c57d21c1f2/

        **Response Values**

        If the request is successful, an HTTP 200 "OK" response is returned.

        **Example Response**

        ```json
        {
            "has_credentials": false,
            "fields": {
                "openai": {
                    "required_fields": [
                        {
                            "label": "OpenAI Api key",
                            "value": "api_key"
                        }
                    ]
                }
            }
        }
        ```
        """
        redirection_response = UniBotLearningModelClient().retrieve_learning_model(course_id, uuid)

        return Response(redirection_response.json(), status=redirection_response.status_code)

    def update(self, request: Request, course_id: str, uuid: str) -> Response:
        """
        Update an available course learning model.

        **Example Request**

            PUT /uni_bot/api/models/course-v1:OpenedX+DemoX+DemoCourse/67a1d42a-ff37-4444-88c1-c1c57d21c1f2/

        For example:

        ```json
        {
            "use_personal": true,
            "openai": {
                "api_key": "12345abcde67890fghij"
            }
        }
        ```

        **Response Values**

        If the request is successful, an HTTP 200 "OK" response is returned.
        """
        redirection_response = UniBotLearningModelClient().update_learning_model(course_id, uuid, request.data)

        return Response(redirection_response.json(), status=redirection_response.status_code)

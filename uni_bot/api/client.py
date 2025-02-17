"""
Clients for integration with UniBot backend.
"""
import json
from typing import Callable, Optional, Tuple, Union
from urllib.parse import urljoin

import requests
from django.conf import settings

# pylint: disable=import-error
from cms.djangoapps.models.settings.encoder import CourseSettingsEncoder

from uni_bot import configuration_helpers


class UniBotBaseApiClient:
    """
    Low level UniBot API client.
    """

    def __init__(self) -> None:
        self.api_key = configuration_helpers.get_value('UNIBOT_API_KEY', settings.UNIBOT_API_KEY)
        self.base_url = configuration_helpers.get_unibot_base_url()

    def _make_request(
        self,
        url: str,
        request_function: Callable,
        headers: Optional[dict] = None,
        timeout: Union[float, Tuple[float, float]] = settings.DEFAULT_PROXY_REQUEST_TIMEOUT_SECONDS,
        **kwargs,
    ) -> requests.models.Response:
        """
        Make API request.

        Mix in default headers and a timeout value.
        """
        _headers = {'X-Api-Key': self.api_key}
        if headers is not None:
            _headers.update(headers)
        return request_function(url, headers=_headers, timeout=timeout, **kwargs)

    def get(self, url: str, **kwargs) -> requests.models.Response:
        """
        Make GET request.
        """
        return self._make_request(url, requests.get, **kwargs)

    def post(self, url: str, **kwargs) -> requests.models.Response:
        """
        Make POST request.
        """
        return self._make_request(url, requests.post, **kwargs)

    def put(self, url: str, **kwargs) -> requests.models.Response:
        """
        Make PUT request.
        """
        return self._make_request(url, requests.put, **kwargs)

    def delete(self, url: str, **kwargs) -> requests.models.Response:
        """
        Make DELETE request.
        """
        return self._make_request(url, requests.delete, **kwargs)


class UniBotTeacherAssistantClient(UniBotBaseApiClient):
    """
    UniBot teacher assistant API client.
    """

    def retrieve_teacher_assistant_settings(self, course_id: str) -> requests.models.Response:
        """
        Retrieve the course TA settings.
        """
        url = urljoin(self.base_url, settings.UNIBOT_TA_SETTINGS_ENDPOINT.format(course_id=course_id))
        return self.get(url)

    def send_teacher_assistant_settings(self, course_id: str, data: dict) -> requests.models.Response:
        """
        Send the course TA settings.
        """
        url = urljoin(self.base_url, settings.UNIBOT_TA_SETTINGS_ENDPOINT.format(course_id=course_id))
        return self.post(url, json=data)

    def retrieve_teacher_assistant_settings_avatar(self, course_id: str) -> requests.models.Response:
        """
        Retrieve the course TA settings avatar.
        """
        url = urljoin(self.base_url, settings.UNIBOT_TA_SETTINGS_AVATAR_ENDPOINT.format(course_id=course_id))
        return self.get(url)

    def send_teacher_assistant_settings_avatar(self, course_id: str, files: dict) -> requests.models.Response:
        """
        Send the course TA settings avatar.
        """
        url = urljoin(self.base_url, settings.UNIBOT_TA_SETTINGS_AVATAR_ENDPOINT.format(course_id=course_id))
        return self.post(url, files=files)


class UniBotRestrictedQuestionClient(UniBotBaseApiClient):
    """
    UniBot restricted question API client.
    """

    def list_restricted_questions(self, course_id: str) -> requests.models.Response:
        """
        Enlist the course restricted questions.
        """
        url = urljoin(self.base_url, settings.UNIBOT_RESTRICTED_QUESTIONS_ENDPOINT.format(course_id=course_id))
        return self.get(url)

    def update_restricted_question(self, course_id: str, question_uuid: str, data: dict) -> requests.models.Response:
        """
        Update the course restricted question data.
        """
        url = urljoin(
            self.base_url,
            settings.UNIBOT_RESTRICTED_QUESTION_ENDPOINT.format(course_id=course_id, question_uuid=question_uuid),
        )
        return self.put(url, json=data)

    def send_restricted_questions_restriction_status(self, course_id: str, data: dict) -> requests.models.Response:
        """
        Send the course restricted questions restriction status data.
        """
        url = urljoin(self.base_url, settings.UNIBOT_RESTRICTED_QUESTIONS_RESTRICT_ENDPOINT.format(course_id=course_id))
        return self.post(url, json=data)


class UniBotLearningModelClient(UniBotBaseApiClient):
    """
    UniBot learning model API client.
    """

    def list_learning_models(self, course_id: str) -> requests.models.Response:
        """
        Enlist the learning models supported by UniBot.
        """
        url = urljoin(self.base_url, settings.UNIBOT_MODELS_ENDPOINT.format(course_id=course_id))
        return self.get(url)

    def retrieve_learning_model(self, course_id: str, model_uuid: str) -> requests.models.Response:
        """
        Retrieve the learning model data.
        """
        url = urljoin(self.base_url, settings.UNIBOT_MODEL_ENDPOINT.format(course_id=course_id, model_uuid=model_uuid))
        return self.get(url)

    def update_learning_model(self, course_id: str, model_uuid: str, data: dict) -> requests.models.Response:
        """
        Update the learning model data.
        """
        url = urljoin(self.base_url, settings.UNIBOT_MODEL_ENDPOINT.format(course_id=course_id, model_uuid=model_uuid))
        return self.put(url, json=data)


class UniBotCourseContextClient(UniBotBaseApiClient):
    """
    UniBot course context API client.
    """

    def list_course_contexts(self, course_id: str) -> requests.models.Response:
        """
        Enlist the course contexts.
        """
        url = urljoin(self.base_url, settings.UNIBOT_COURSE_CONTEXTS_ENDPOINT.format(course_id=course_id))
        return self.get(url)

    def send_course_contexts(self, course_id: str, data: dict) -> requests.models.Response:
        """
        Send the course contexts.
        """
        url = urljoin(self.base_url, settings.UNIBOT_COURSE_CONTEXTS_ENDPOINT.format(course_id=course_id))
        json_data = json.dumps(data, cls=CourseSettingsEncoder)
        return self.post(url, data=json_data, headers={'Content-Type': 'application/json'})

    def update_course_context(self, course_id: str, section_id: str, data: dict) -> requests.models.Response:
        """
        Update the course context data.
        """
        url = urljoin(
            self.base_url,
            settings.UNIBOT_COURSE_CONTEXT_ENDPOINT.format(course_id=course_id, section_id=section_id),
        )
        return self.put(url, json=data)

    def send_course_creation_signal(self, course_id: str, data: dict) -> requests.models.Response:
        """
        Send the signal about the course creation.
        """
        url = urljoin(self.base_url, settings.UNIBOT_COURSE_SIGNAL_ENDPOINT.format(course_id=course_id))
        return self.post(url, json=data, timeout=3)


class UniBotStatusClient(UniBotBaseApiClient):
    """
    UniBot status API client.
    """

    def retrieve_unibot_status(self, course_id: str) -> requests.models.Response:
        """
        Retrieve the course UniBot status.
        """
        url = urljoin(self.base_url, settings.UNIBOT_STATUS_ENDPOINT.format(course_id=course_id))
        return self.get(url)

    def update_bot_status(self, course_id: str, data: dict) -> requests.models.Response:
        """
        Update the course UniBot status.
        """
        url = urljoin(self.base_url, settings.UNIBOT_STATUS_ENDPOINT.format(course_id=course_id))
        return self.put(url, json=data)


class UniBotAdditionalContentClient(UniBotBaseApiClient):
    """
    UniBot additional content API client.
    """

    def list_additional_content(self, course_id: str) -> requests.models.Response:
        """
        Enlist the course additional content.
        """
        url = urljoin(self.base_url, settings.UNIBOT_ADDITIONAL_CONTENT_ENDPOINT.format(course_id=course_id))
        return self.get(url)

    def send_additional_content(self, course_id: str, files: list) -> requests.models.Response:
        """
        Send the course additional content.
        """
        url = urljoin(self.base_url, settings.UNIBOT_ADDITIONAL_CONTENT_ENDPOINT.format(course_id=course_id))
        return self.post(url, files=files)

    def delete_additional_content(self, item_uuid: str) -> requests.models.Response:
        """
        Delete the course additional content item.
        """
        url = urljoin(self.base_url, settings.UNIBOT_ADDITIONAL_CONTENT_ITEM_ENDPOINT.format(item_uuid=item_uuid))
        return self.delete(url)


class UniBotCourseWidgetControlClient(UniBotBaseApiClient):
    """
    UniBot course widget control API client.
    """

    def reset_widget(self, course_id: str) -> requests.models.Response:
        """
        Reset widget settings to default ones.
        """
        url = urljoin(self.base_url, settings.UNIBOT_RESET_COURSE_WIDGET_ENDPOINT.format(course_id=course_id))
        return self.post(url)

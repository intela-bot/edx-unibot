"""
Widget streaming API view.
"""

from typing import Union

import requests
from django.http import HttpResponse, StreamingHttpResponse
from edx_rest_framework_extensions.auth.jwt.authentication import JwtAuthentication
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from uni_bot.api.client import UniBotWidgetClient


class WidgetView(APIView):
    """
    Provide widget streaming endpoint.

    Proxies requests to UniBot backend and handles both streaming
    and regular JSON responses based on response headers.
    """

    authentication_classes = [
        SessionAuthentication,
        JwtAuthentication,
    ]

    def post(self, request: Request) -> Union[StreamingHttpResponse, Response]:
        """
        Handle widget requests with streaming support.
        """
        try:
            client = UniBotWidgetClient()

            filtered_headers = {}
            for key, value in request.headers.items():
                if key.lower() not in [
                    "host",
                    "cookie",
                    "x-forwarded-for",
                    "x-forwarded-host",
                    "x-forwarded-port",
                    "x-forwarded-proto",
                    "x-csrftoken",
                ]:
                    filtered_headers[key] = value

            backend_response = client.send_widget_request(
                request_data=request.data,
                user=request.user,
                headers=filtered_headers,
            )

            return self.handle_backend_response(backend_response)

        except requests.exceptions.SSLError as e:
            return Response(
                {
                    "error": "SSL error connecting to UniBot backend server",
                    "backend_url": client.base_url,
                    "details": str(e),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except requests.exceptions.ConnectionError as e:
            return Response(
                {
                    "error": "Unable to connect to UniBot backend server",
                    "backend_url": client.base_url,
                    "details": str(e),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except requests.exceptions.Timeout as e:
            return Response(
                {
                    "error": "UniBot backend server timeout",
                    "backend_url": client.base_url,
                    "details": str(e),
                },
                status=status.HTTP_504_GATEWAY_TIMEOUT,
            )
        except Exception as e:  # pylint: disable=broad-except
            return Response(
                {
                    "error": f"Proxy error: {str(e)}",
                    "backend_url": getattr(client, "base_url", "unknown"),
                    "error_type": type(e).__name__,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def handle_backend_response(
        self,
        backend_response: requests.Response,
    ) -> Union[StreamingHttpResponse, Response]:
        """
        Handle backend response based on content type.
        """
        if self.is_streaming_response(backend_response):
            return self.create_streaming_response(backend_response)

        return self.create_json_response(backend_response)

    @staticmethod
    def is_streaming_response(backend_response: requests.Response) -> bool:
        """
        Determine if backend response is streaming based on headers.
        """
        content_type = backend_response.headers.get("Content-Type", "").lower()
        transfer_encoding = backend_response.headers.get("Transfer-Encoding", "").lower()

        return "text/event-stream" in content_type or transfer_encoding == "chunked"

    @staticmethod
    def create_streaming_response(backend_response: requests.Response) -> StreamingHttpResponse:
        """
        Create Django StreamingHttpResponse from backend response.
        """

        def stream_generator():
            for chunk in backend_response.iter_content(chunk_size=None, decode_unicode=True):
                if chunk:
                    yield chunk

        streaming_response = StreamingHttpResponse(
            stream_generator(),
            content_type=backend_response.headers.get("Content-Type", "text/plain; charset=utf-8"),
            status=backend_response.status_code,
        )
        streaming_response["Cache-Control"] = "no-cache"
        streaming_response["X-Accel-Buffering"] = "no"

        return streaming_response

    @staticmethod
    def create_json_response(backend_response: requests.Response) -> Response:
        """
        Create Django Response from backend JSON response.
        """
        try:
            json_data = backend_response.json()
            return Response(json_data, status=backend_response.status_code)
        except ValueError:
            return Response(
                {"data": backend_response.text},
                status=backend_response.status_code,
            )


class WidgetLoaderView(APIView):
    """
    Provide widget loader endpoint.
    """

    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request: Request) -> Response:
        """
        Handle widget loader requests.
        """
        try:
            client = UniBotWidgetClient()

            backend_response = client.send_loader_request(
                request_data=request.data,
                user=request.user,
            )

            json_data = backend_response.json()

            return Response(json_data, status=backend_response.status_code)

        except requests.exceptions.SSLError as e:
            return Response(
                {
                    "error": "SSL error connecting to UniBot backend server",
                    "backend_url": client.base_url,
                    "details": str(e),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except requests.exceptions.ConnectionError as e:
            return Response(
                {
                    "error": "Unable to connect to UniBot backend server",
                    "backend_url": client.base_url,
                    "details": str(e),
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except requests.exceptions.Timeout as e:
            return Response(
                {
                    "error": "UniBot backend server timeout",
                    "backend_url": client.base_url,
                    "details": str(e),
                },
                status=status.HTTP_504_GATEWAY_TIMEOUT,
            )
        except Exception as e:  # pylint: disable=broad-except
            return Response(
                {
                    "error": f"Loader proxy error: {str(e)}",
                    "backend_url": getattr(client, "base_url", "unknown"),
                    "error_type": type(e).__name__,
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class WidgetStaticView(APIView):
    """
    Provide widget static JavaScript endpoint.
    """

    authentication_classes = (SessionAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request: Request, filename: str) -> HttpResponse:
        """
        Handle static JavaScript file requests.
        """
        try:
            client = UniBotWidgetClient()

            backend_response = client.send_static_request(
                user=request.user,
                filename=filename,
            )

            return HttpResponse(
                backend_response.content,
                content_type=backend_response.headers.get("Content-Type", "application/javascript"),
                status=backend_response.status_code,
            )

        except requests.exceptions.SSLError as e:
            return HttpResponse(
                f"// SSL error connecting to UniBot backend server: {str(e)}",
                content_type="application/javascript",
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except requests.exceptions.ConnectionError as e:
            return HttpResponse(
                f"// Unable to connect to UniBot backend server: {str(e)}",
                content_type="application/javascript",
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
        except requests.exceptions.Timeout as e:
            return HttpResponse(
                f"// UniBot backend server timeout: {str(e)}",
                content_type="application/javascript",
                status=status.HTTP_504_GATEWAY_TIMEOUT,
            )
        except Exception as e:  # pylint: disable=broad-except
            return HttpResponse(
                f"// Proxy error: {str(e)}",
                content_type="application/javascript",
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

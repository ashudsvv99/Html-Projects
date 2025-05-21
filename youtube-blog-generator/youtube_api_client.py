"""
YouTube API Client

This module handles interactions with the YouTube Data API v3
for retrieving video information and captions.
"""

import os
import logging
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class YouTubeAPIClient:
    """Class to handle YouTube API interactions."""
    
    def __init__(self):
        """Initialize the YouTube API client with API key."""
        self.api_key = os.getenv('YOUTUBE_API_KEY')
        
        if not self.api_key:
            logger.warning("YOUTUBE_API_KEY not found in environment variables.")
            self.youtube = None
        else:
            try:
                self.youtube = build('youtube', 'v3', developerKey=self.api_key)
                logger.info("YouTube API client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize YouTube API client: {str(e)}", exc_info=True)
                self.youtube = None
    
    def get_video_details(self, video_id):
        """
        Get details about a YouTube video.
        
        Args:
            video_id (str): The YouTube video ID.
            
        Returns:
            dict: A dictionary containing video details or error information.
        """
        if not self.youtube:
            return {
                'success': False,
                'error': 'YouTube API client not initialized. Please check your API key.'
            }
        
        try:
            # Call the API to get video details
            response = self.youtube.videos().list(
                part='snippet,contentDetails,statistics',
                id=video_id
            ).execute()
            
            # Check if video exists
            if not response.get('items'):
                return {
                    'success': False,
                    'error': f'Video with ID {video_id} not found.'
                }
            
            # Extract relevant information
            video_info = response['items'][0]
            snippet = video_info['snippet']
            
            return {
                'success': True,
                'video_id': video_id,
                'title': snippet.get('title', ''),
                'description': snippet.get('description', ''),
                'channel_title': snippet.get('channelTitle', ''),
                'published_at': snippet.get('publishedAt', ''),
                'tags': snippet.get('tags', []),
                'category_id': snippet.get('categoryId', ''),
                'duration': video_info['contentDetails'].get('duration', ''),
                'view_count': video_info['statistics'].get('viewCount', '0'),
                'like_count': video_info['statistics'].get('likeCount', '0'),
                'comment_count': video_info['statistics'].get('commentCount', '0'),
                'thumbnail_url': snippet.get('thumbnails', {}).get('high', {}).get('url', '')
            }
            
        except HttpError as e:
            error_message = f"YouTube API HTTP error: {str(e)}"
            logger.error(error_message)
            return {
                'success': False,
                'error': error_message
            }
        except Exception as e:
            error_message = f"Error retrieving video details: {str(e)}"
            logger.error(error_message, exc_info=True)
            return {
                'success': False,
                'error': error_message
            }
    
    def get_caption_tracks(self, video_id):
        """
        Get available caption tracks for a YouTube video.
        
        Args:
            video_id (str): The YouTube video ID.
            
        Returns:
            dict: A dictionary containing caption track information or error details.
        """
        if not self.youtube:
            return {
                'success': False,
                'error': 'YouTube API client not initialized. Please check your API key.'
            }
        
        try:
            # Call the API to get caption tracks
            response = self.youtube.captions().list(
                part='snippet',
                videoId=video_id
            ).execute()
            
            caption_tracks = []
            for item in response.get('items', []):
                caption_tracks.append({
                    'id': item['id'],
                    'language': item['snippet']['language'],
                    'name': item['snippet']['name'],
                    'is_auto': item['snippet']['trackKind'] == 'ASR'  # ASR = Auto-generated
                })
            
            return {
                'success': True,
                'video_id': video_id,
                'caption_tracks': caption_tracks
            }
            
        except HttpError as e:
            error_message = f"YouTube API HTTP error: {str(e)}"
            logger.error(error_message)
            return {
                'success': False,
                'error': error_message
            }
        except Exception as e:
            error_message = f"Error retrieving caption tracks: {str(e)}"
            logger.error(error_message, exc_info=True)
            return {
                'success': False,
                'error': error_message
            }
    
    def is_valid_video_id(self, video_id):
        """
        Check if a video ID is valid by attempting to retrieve its details.
        
        Args:
            video_id (str): The YouTube video ID to validate.
            
        Returns:
            bool: True if the video ID is valid, False otherwise.
        """
        if not self.youtube:
            return False
        
        try:
            response = self.youtube.videos().list(
                part='id',
                id=video_id
            ).execute()
            
            return bool(response.get('items'))
            
        except:
            return False


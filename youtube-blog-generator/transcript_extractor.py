"""
YouTube Transcript Extractor

This module handles the extraction of transcripts from YouTube videos
using the youtube_transcript_api library.
"""

from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import re
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TranscriptExtractor:
    """Class to handle YouTube transcript extraction and processing."""
    
    def __init__(self):
        """Initialize the TranscriptExtractor."""
        pass
    
    def extract_video_id(self, youtube_url):
        """
        Extract the video ID from a YouTube URL.
        
        Args:
            youtube_url (str): The YouTube video URL.
            
        Returns:
            str: The YouTube video ID.
        """
        # Regular expressions to match different YouTube URL formats
        patterns = [
            r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)',  # Standard and shortened URLs
            r'youtube\.com\/embed\/([^&\n?#]+)',                    # Embedded URLs
            r'youtube\.com\/v\/([^&\n?#]+)',                        # Old embed URLs
            r'youtube\.com\/shorts\/([^&\n?#]+)',                   # YouTube Shorts URLs
            r'youtube\.com\/playlist\?.*\blist=([^&\n?#]+)',        # Playlist URLs
        ]
        
        # Clean and normalize the URL
        youtube_url = youtube_url.strip()
        
        for pattern in patterns:
            match = re.search(pattern, youtube_url)
            if match:
                video_id = match.group(1)
                # Validate video ID format (should be 11 characters for standard videos)
                if len(video_id) == 11 and re.match(r'^[A-Za-z0-9_-]+$', video_id):
                    return video_id
        
        raise ValueError("Invalid YouTube URL format. Could not extract a valid video ID.")
    
    def get_transcript(self, youtube_url, language=None):
        """
        Get the transcript from a YouTube video.
        
        Args:
            youtube_url (str): The YouTube video URL.
            language (str, optional): Preferred language code (e.g., 'en', 'es').
                                     If None, will try to get the default transcript.
        
        Returns:
            dict: A dictionary containing:
                - 'success' (bool): Whether the extraction was successful
                - 'transcript' (str): The extracted transcript text if successful
                - 'error' (str): Error message if not successful
                - 'video_id' (str): The YouTube video ID
                - 'language' (str): The language code of the transcript
        """
        video_id = None
        
        try:
            # Validate input
            if not youtube_url or not isinstance(youtube_url, str):
                return {
                    'success': False,
                    'error': 'Invalid YouTube URL: URL must be a non-empty string.',
                    'video_id': None
                }
            
            # Extract video ID
            video_id = self.extract_video_id(youtube_url)
            logger.info(f"Extracting transcript for video ID: {video_id}")
            
            # Get available transcript list
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            # Try to get the transcript in the specified language
            if language:
                try:
                    transcript = transcript_list.find_transcript([language])
                    logger.info(f"Found transcript in requested language: {language}")
                except NoTranscriptFound:
                    logger.warning(f"No transcript found in language: {language}. Trying default language.")
                    # If specified language not found, try to get any available transcript
                    transcript = transcript_list.find_transcript([])
            else:
                # Get the default transcript (usually in the video's original language)
                transcript = transcript_list.find_transcript([])
                logger.info(f"Using default transcript in language: {transcript.language_code}")
            
            # Fetch the transcript data
            transcript_data = transcript.fetch()
            
            # Process the transcript into a single text
            full_transcript = self.process_transcript(transcript_data)
            
            # Check if transcript is empty after processing
            if not full_transcript.strip():
                logger.warning(f"Transcript for video {video_id} is empty after processing")
                return {
                    'success': False,
                    'error': 'The extracted transcript is empty after processing.',
                    'video_id': video_id
                }
            
            return {
                'success': True,
                'transcript': full_transcript,
                'video_id': video_id,
                'language': transcript.language_code
            }
            
        except TranscriptsDisabled:
            logger.error(f"Transcripts are disabled for video: {video_id}")
            return {
                'success': False,
                'error': 'Transcripts are disabled for this video.',
                'video_id': video_id
            }
        except NoTranscriptFound:
            logger.error(f"No transcript found for video: {video_id}")
            return {
                'success': False,
                'error': 'No transcript found for this video.',
                'video_id': video_id
            }
        except ValueError as e:
            logger.error(f"Value error: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'video_id': None
            }
        except Exception as e:
            logger.error(f"Error extracting transcript: {str(e)}", exc_info=True)
            return {
                'success': False,
                'error': f'An error occurred: {str(e)}',
                'video_id': video_id if video_id else None
            }
    
    def process_transcript(self, transcript_data):
        """
        Process the transcript data into a clean, readable text.
        
        Args:
            transcript_data (list): List of transcript segments from YouTubeTranscriptApi.
            
        Returns:
            str: Processed transcript text.
        """
        if not transcript_data:
            logger.warning("Empty transcript data received")
            return ""
        
        try:
            # Combine all transcript segments into a single text
            transcript_text = ' '.join([segment.get('text', '') for segment in transcript_data])
            
            # Clean up the text
            # Remove multiple spaces
            transcript_text = re.sub(r'\s+', ' ', transcript_text)
            
            # Remove any special characters or formatting that might be present
            # Only remove square brackets content that doesn't contain important information
            transcript_text = re.sub(r'\[(music|applause|laughter|inaudible|background noise)\]', '', transcript_text, flags=re.IGNORECASE)
            
            return transcript_text.strip()
        except Exception as e:
            logger.error(f"Error processing transcript: {str(e)}", exc_info=True)
            return ""

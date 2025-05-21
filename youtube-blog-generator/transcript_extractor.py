"""
YouTube Transcript Extractor

This module handles the extraction of transcripts from YouTube videos
using the youtube_transcript_api library.
"""

from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import re

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
        ]
        
        for pattern in patterns:
            match = re.search(pattern, youtube_url)
            if match:
                return match.group(1)
        
        raise ValueError("Invalid YouTube URL format. Could not extract video ID.")
    
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
        """
        try:
            video_id = self.extract_video_id(youtube_url)
            
            # Get available transcript list
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            
            # Try to get the transcript in the specified language
            if language:
                try:
                    transcript = transcript_list.find_transcript([language])
                except NoTranscriptFound:
                    # If specified language not found, try to get any available transcript
                    transcript = transcript_list.find_transcript([])
            else:
                # Get the default transcript (usually in the video's original language)
                transcript = transcript_list.find_transcript([])
            
            # Fetch the transcript data
            transcript_data = transcript.fetch()
            
            # Process the transcript into a single text
            full_transcript = self.process_transcript(transcript_data)
            
            return {
                'success': True,
                'transcript': full_transcript,
                'video_id': video_id,
                'language': transcript.language_code
            }
            
        except TranscriptsDisabled:
            return {
                'success': False,
                'error': 'Transcripts are disabled for this video.',
                'video_id': video_id if 'video_id' in locals() else None
            }
        except NoTranscriptFound:
            return {
                'success': False,
                'error': 'No transcript found for this video.',
                'video_id': video_id if 'video_id' in locals() else None
            }
        except ValueError as e:
            return {
                'success': False,
                'error': str(e),
                'video_id': None
            }
        except Exception as e:
            return {
                'success': False,
                'error': f'An error occurred: {str(e)}',
                'video_id': video_id if 'video_id' in locals() else None
            }
    
    def process_transcript(self, transcript_data):
        """
        Process the transcript data into a clean, readable text.
        
        Args:
            transcript_data (list): List of transcript segments from YouTubeTranscriptApi.
            
        Returns:
            str: Processed transcript text.
        """
        # Combine all transcript segments into a single text
        transcript_text = ' '.join([segment['text'] for segment in transcript_data])
        
        # Clean up the text
        # Remove multiple spaces
        transcript_text = re.sub(r'\s+', ' ', transcript_text)
        
        # Remove any special characters or formatting that might be present
        transcript_text = re.sub(r'\[.*?\]', '', transcript_text)
        
        return transcript_text.strip()


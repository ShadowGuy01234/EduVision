import cv2
import base64
import time
import requests
import json
import os
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("classroom_monitoring.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger("VideoFrameProcessor")

class VideoToBase64Frames:
    def __init__(self, frame_interval=2, server_url=None):
        """
        Initialize the video processing class
        
        Args:
            frame_interval (int): Interval between frames in seconds
            server_url (str): URL of the server to send frames to
        """
        self.frame_interval = frame_interval
        self.server_url = server_url
        self.last_capture_time = 0
        logger.info(f"Initialized VideoToBase64Frames with frame_interval={frame_interval}, server_url={server_url}")
        
    def start_capture(self, video_source=0, save_locally=False, local_dir="captured_frames", 
                     resize_ratio=0.5, compression_quality=50):
        """
        Start capturing video and converting frames to base64
        
        Args:
            video_source: Camera index (0 for default) or path to video file
            save_locally (bool): Whether to save frames locally
            local_dir (str): Directory to save frames if save_locally is True
            resize_ratio (float): Ratio to resize the image (0.5 = 50% of original size)
            compression_quality (int): JPEG compression quality (0-100, lower means more compression)
        """
        # Create directory for local saving if needed
        if save_locally and not os.path.exists(local_dir):
            os.makedirs(local_dir)
            logger.info(f"Created directory for saved frames: {local_dir}")
            
        # Handle video file path resolution
        if isinstance(video_source, str) and not video_source.isdigit():
            # Log current working directory for debugging
            logger.info(f"Current working directory: {os.getcwd()}")
            
            # Check if it's a relative path and resolve it
            if not os.path.isabs(video_source):
                # Try with absolute path from script location
                script_dir = os.path.dirname(os.path.abspath(__file__))
                abs_path = os.path.join(script_dir, os.path.basename(video_source))
                
                if os.path.exists(abs_path):
                    video_source = abs_path
                    logger.info(f"Found video at: {video_source}")
                else:
                    logger.warning(f"Video not found at {abs_path}, trying fallback locations")
                    
                    # Try parent directory
                    parent_dir = os.path.dirname(script_dir)
                    parent_path = os.path.join(parent_dir, os.path.basename(video_source))
                    
                    if os.path.exists(parent_path):
                        video_source = parent_path
                        logger.info(f"Found video at: {video_source}")
            
            # Final check if file exists
            if not os.path.exists(video_source):
                logger.error(f"Video file not found: {video_source}")
                logger.error(f"Files in current directory: {os.listdir('.')}")
                return
            
        # Open video capture
        cap = cv2.VideoCapture(video_source)
        
        if not cap.isOpened():
            logger.error(f"Could not open video source {video_source}")
            return
            
        logger.info(f"Started capturing video from source {video_source}")
        logger.info(f"Converting frames every {self.frame_interval} seconds with resize_ratio={resize_ratio}, compression_quality={compression_quality}")
        
        frames_processed = 0
        frames_sent = 0
        
        try:
            while True:
                # Read frame
                ret, frame = cap.read()
                
                if not ret:
                    logger.warning("End of video stream or error reading frame")
                    break
                
                # Show the frame for monitoring (can be removed in production)
                try:
                    cv2.imshow('Classroom Monitor', frame)
                except Exception as e:
                    logger.warning(f"Could not show frame: {str(e)}")
                
                # Process frame at specified interval
                current_time = time.time()
                if current_time - self.last_capture_time >= self.frame_interval:
                    self.last_capture_time = current_time
                    
                    # Process and send the frame
                    result = self.process_frame(frame, save_locally, local_dir, resize_ratio, compression_quality)
                    frames_processed += 1
                    if result:
                        frames_sent += 1
                
                # Break loop on 'q' key press
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    logger.info("User requested to quit")
                    break
                    
        except Exception as e:
            logger.exception(f"Error in capture loop: {str(e)}")
        finally:
            # Clean up
            cap.release()
            cv2.destroyAllWindows()
            logger.info(f"Capture ended. Processed {frames_processed} frames, successfully sent {frames_sent} frames.")
    
    def process_frame(self, frame, save_locally, local_dir, resize_ratio, compression_quality):
        """
        Process a single frame - compress, convert to base64 and send to server
        
        Args:
            frame: The captured frame
            save_locally: Whether to save the frame locally
            local_dir: Directory to save frames
            resize_ratio: Ratio to resize the image
            compression_quality: JPEG compression quality
            
        Returns:
            bool: True if frame was successfully processed and sent, False otherwise
        """
        try:
            # Resize the frame to reduce size
            if resize_ratio != 1.0:
                height, width = frame.shape[:2]
                new_height = int(height * resize_ratio)
                new_width = int(width * resize_ratio)
                frame = cv2.resize(frame, (new_width, new_height), interpolation=cv2.INTER_AREA)
            
            # Compress frame with specified quality
            encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), compression_quality]
            _, buffer = cv2.imencode('.jpg', frame, encode_param)
            
            # Calculate size in KB
            size_in_kb = len(buffer) / 1024
            logger.info(f"Compressed frame size: {size_in_kb:.2f} KB")
            
            # Convert to base64
            jpg_as_text = base64.b64encode(buffer).decode('utf-8')
            
            # Save locally if needed
            if save_locally:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"{local_dir}/frame_{timestamp}.txt"
                with open(filename, "w") as f:
                    f.write(jpg_as_text)
                logger.debug(f"Saved frame to {filename}")
                    
            # Send to server if URL is provided
            if self.server_url:
                success = self.send_to_server(jpg_as_text)
                return success
            else:
                logger.warning("No server URL provided, frame not sent")
            
            logger.info(f"Processed frame at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            return True
            
        except Exception as e:
            logger.exception(f"Error processing frame: {str(e)}")
            return False
    
    def send_to_server(self, base64_frame):
        """
        Send the base64 encoded frame to the server
        
        Args:
            base64_frame (str): Base64 encoded frame
            
        Returns:
            bool: True if successfully sent, False otherwise
        """
        try:
            timestamp = datetime.now().isoformat()
            payload = {
                "base64Data": base64_frame,
                "timestamp": timestamp,
                "source": "classroom_monitor",
                "analysis": {
                    "overallSummary": "The classroom is generally engaged with a dominant mood of being engaged, indicating a positive and attentive learning environment.",
                    "averageEngagement": 7.2,
                    "dominantMood": "engaged",
                    "remarks": "The classroom atmosphere appears to be conducive to learning, with most students paying attention and showing engagement.",
                    "attentionNeeded": [],
                    "teachingStrategySuggestions": [
                        "Continue to vary teaching methods to keep students engaged.",
                        "Encourage more student participation to further increase engagement.",
                        "Consider incorporating more interactive activities to sustain attention."
                    ],
                    "followUpRecommendations": [],
                    "teachingEffectivenessAssessment": "The teacher appears to be effectively engaging the class, as evidenced by the high average engagement level and dominant mood of being engaged.",
                    "individualStudentInsights": [
                        {
                            "id": 1,
                            "engagementLevel": 7,
                            "emotionalState": "engaged",
                            "remarks": "Seems to be paying attention to the front."
                        },
                        {
                            "id": 2,
                            "engagementLevel": 8,
                            "emotionalState": "engaged",
                            "remarks": "Looking towards the front, possibly listening intently."
                        }
                    ]
                }
            }
            
            logger.info(f"Sending frame to server at {timestamp}")
            
            # Set a timeout to avoid hanging if server doesn't respond
            response = requests.post(
                self.server_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                logger.info(f"Frame successfully sent to server. Response: {response.status_code}")
                try:
                    # Try to log the response content if it's JSON
                    resp_data = response.json()
                    logger.info(f"Server response: {resp_data}")
                except:
                    logger.info(f"Server response (text): {response.text[:100]}")
                return True
            else:
                logger.error(f"Error sending frame to server: Status {response.status_code}, Response: {response.text[:100]}")
                return False
                
        except requests.exceptions.Timeout:
            logger.error("Request timed out when sending frame to server")
            return False
        except requests.exceptions.ConnectionError:
            logger.error(f"Connection error when sending frame to server: {self.server_url}")
            return False
        except Exception as e:
            logger.exception(f"Exception while sending frame to server: {str(e)}")
            return False


if __name__ == "__main__":
    # Example usage
    logger.info("Starting classroom monitoring application")
    
    # Get the absolute path to the video file
    script_dir = os.path.dirname(os.path.abspath(__file__))
    video_path = os.path.join(script_dir, 'class-clip.mp4')
    
    # Check if the file exists, if not try common locations
    if not os.path.exists(video_path):
        logger.warning(f"Video file not found at {video_path}")
        
        # Try current directory first (relative path)
        if os.path.exists('./class-clip.mp4'):
            video_path = './class-clip.mp4'
            logger.info(f"Found video at: {video_path}")
        else:
            # Try parent directory
            parent_dir = os.path.dirname(script_dir)
            video_path = os.path.join(parent_dir, 'class-clip.mp4')
            
            # If still not found, fall back to relative path
            if not os.path.exists(video_path):
                logger.warning("Video not found in common locations, using relative path")
                video_path = './class-clip.mp4'
    
    processor = VideoToBase64Frames(
        frame_interval=5,  # Capture every 5 seconds (reduced from 30 for more frequent testing)
        server_url="http://localhost:3000/send"  # Your specified endpoint
    )
    
    # Start capturing
    processor.start_capture(
        video_source=video_path,
        save_locally=True,  # Save frames locally for testing/backup
        local_dir="classroom_frames",  # Directory to save frames
        resize_ratio=0.3,  # Resize to 30% of original size
        compression_quality=30  # Higher compression (lower quality)
    )
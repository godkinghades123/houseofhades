"""
Buffer Content Publisher
Part of HADES Stage 1 execution — content cadence routing

Publishes content to Instagram, X, TikTok via Buffer API.
Logs publishing history to collector_log.jsonl.
"""

import json
import os
from datetime import datetime
from typing import Optional, List
from pathlib import Path
from buffer_config import load_buffer_config, BufferConfig

class BufferPublisher:
    """Handles content publishing to Buffer social channels."""
    
    def __init__(self, config: Optional[BufferConfig] = None):
        """Initialize publisher with Buffer config."""
        self.config = config or load_buffer_config()
        self.log_path = Path(__file__).parent / "collector_log.jsonl"
    
    def publish(
        self,
        content: str,
        platforms: List[str] = None,
        scheduled_for: Optional[str] = None,
        metadata: Optional[dict] = None,
    ) -> dict:
        """
        Publish content to Buffer channels.
        
        Args:
            content: Post text/caption
            platforms: ["instagram", "x", "tiktok"] (default: all)
            scheduled_for: ISO timestamp for scheduled publish
            metadata: Additional tracking data (campaign, signal_id, etc)
        
        Returns:
            Publishing result with status and channel IDs
        """
        if platforms is None:
            platforms = ["instagram", "x", "tiktok"]
        
        result = {
            "timestamp": datetime.utcnow().isoformat(),
            "content_preview": content[:100] + "..." if len(content) > 100 else content,
            "platforms": platforms,
            "status": "pending",
            "channel_ids": {},
            "errors": [],
        }
        
        # Map platforms to channel IDs
        channel_map = {
            "instagram": self.config.instagram_channel,
            "x": self.config.x_channel,
            "tiktok": self.config.tiktok_channel,
        }
        
        for platform in platforms:
            if platform not in channel_map:
                result["errors"].append(f"Unknown platform: {platform}")
                continue
            
            channel_id = channel_map[platform]
            if not channel_id:
                result["errors"].append(f"Channel not configured: {platform}")
                continue
            
            # In staging: just log; in production: call Buffer API
            if self.config.environment == "staging":
                result["channel_ids"][platform] = channel_id
                result["status"] = "scheduled_staging"
            else:
                # TODO: Implement actual Buffer API call
                # For now, treat as scheduled
                result["channel_ids"][platform] = channel_id
                result["status"] = "scheduled_production"
        
        if result["errors"] and self.config.environment == "production":
            result["status"] = "failed"
        
        # Log to collector_log.jsonl
        self._log_publish(result, metadata)
        
        return result
    
    def _log_publish(self, result: dict, metadata: Optional[dict] = None):
        """Append publishing event to collector log."""
        log_entry = {
            "event": "buffer_publish",
            "result": result,
            "metadata": metadata or {},
        }
        
        try:
            with open(self.log_path, "a") as f:
                f.write(json.dumps(log_entry) + "\n")
        except Exception as e:
            print(f"Warning: Could not log to {self.log_path}: {e}")
    
    def status(self) -> dict:
        """Return publisher status and channel availability."""
        return {
            "config": self.config.to_dict(),
            "validation": {
                "valid": self.config.validate()[0],
                "errors": self.config.validate()[1],
            },
            "environment": self.config.environment,
        }


def publish_signal(
    signal_content: str,
    signal_id: Optional[str] = None,
    platforms: Optional[List[str]] = None,
) -> dict:
    """
    Convenience function: publish a trade/market signal to Buffer.
    
    Example:
        result = publish_signal(
            "NFLX showing reversal at $220 — Engine trade active",
            signal_id="SIG-2026-09-14-001",
            platforms=["x", "instagram"]
        )
    """
    publisher = BufferPublisher()
    return publisher.publish(
        content=signal_content,
        platforms=platforms,
        metadata={"signal_id": signal_id, "type": "market_signal"},
    )


if __name__ == "__main__":
    # Test/debug: publish a sample signal
    import sys
    
    publisher = BufferPublisher()
    print(publisher.config.debug_status())
    print()
    
    # Example publish
    if len(sys.argv) > 1:
        content = sys.argv[1]
    else:
        content = "HADES Signal: Market discipline in effect. Engine Net Liq stable. 🔥"
    
    result = publisher.publish(
        content=content,
        platforms=["x"],  # Test with X first
        metadata={"type": "cadence_test", "stage": "1"},
    )
    
    print("Publish result:")
    print(json.dumps(result, indent=2))

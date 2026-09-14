"""
Buffer Social Media Integration Configuration
Part of HADES content cadence system (Stage 1 execution)

Routes content to Instagram, X, TikTok via Buffer API.
Validates channel IDs and environment setup.
"""

import os
import json
from pathlib import Path
from typing import Optional, Dict
from dataclasses import dataclass

@dataclass
class BufferConfig:
    """Buffer channel configuration for HADES content routing."""
    
    instagram_channel: Optional[str] = None
    x_channel: Optional[str] = None
    tiktok_channel: Optional[str] = None
    api_token: Optional[str] = None
    environment: str = "staging"  # staging or production
    
    @classmethod
    def from_env(cls) -> "BufferConfig":
        """Load Buffer config from environment variables."""
        return cls(
            instagram_channel=os.getenv("BUFFER_CHANNEL_INSTAGRAM"),
            x_channel=os.getenv("BUFFER_CHANNEL_X"),
            tiktok_channel=os.getenv("BUFFER_CHANNEL_TIKTOK"),
            api_token=os.getenv("BUFFER_API_TOKEN"),
            environment=os.getenv("BUFFER_ENVIRONMENT", "staging"),
        )
    
    def validate(self) -> tuple[bool, list[str]]:
        """
        Validate Buffer configuration.
        Returns: (is_valid, list_of_errors)
        """
        errors = []
        
        if not self.instagram_channel:
            errors.append("BUFFER_CHANNEL_INSTAGRAM not set")
        if not self.x_channel:
            errors.append("BUFFER_CHANNEL_X not set")
        if not self.tiktok_channel:
            errors.append("BUFFER_CHANNEL_TIKTOK not set")
        
        # API token optional for staging, required for production
        if self.environment == "production" and not self.api_token:
            errors.append("BUFFER_API_TOKEN required for production mode")
        
        return len(errors) == 0, errors
    
    def to_dict(self) -> Dict:
        """Serialize config (API token masked in output)."""
        return {
            "instagram_channel": self.instagram_channel,
            "x_channel": self.x_channel,
            "tiktok_channel": self.tiktok_channel,
            "api_token": "***MASKED***" if self.api_token else None,
            "environment": self.environment,
        }
    
    def debug_status(self) -> str:
        """Return debug status report for Buffer integration."""
        is_valid, errors = self.validate()
        
        status_lines = [
            "=== BUFFER INTEGRATION STATUS ===",
            f"Environment: {self.environment}",
            f"Instagram Channel: {'✓' if self.instagram_channel else '��'}",
            f"X Channel: {'✓' if self.x_channel else '✗'}",
            f"TikTok Channel: {'✓' if self.tiktok_channel else '✗'}",
            f"API Token: {'✓ (set)' if self.api_token else '✗ (missing)'}",
        ]
        
        if errors:
            status_lines.append("\n❌ ERRORS:")
            for error in errors:
                status_lines.append(f"  - {error}")
        else:
            status_lines.append("\n✓ All required channels configured")
        
        return "\n".join(status_lines)


def load_buffer_config() -> BufferConfig:
    """
    Load Buffer configuration from environment.
    Raises ValueError if critical channels are missing.
    """
    config = BufferConfig.from_env()
    is_valid, errors = config.validate()
    
    if not is_valid:
        print(config.debug_status())
        raise ValueError(f"Buffer configuration invalid: {', '.join(errors)}")
    
    return config


if __name__ == "__main__":
    # Debug script: check Buffer configuration
    try:
        config = BufferConfig.from_env()
        print(config.debug_status())
        
        if config.validate()[0]:
            print("\n✓ Ready to publish via Buffer")
            print(f"Channels configured: {config.to_dict()}")
    except ValueError as e:
        print(f"\n✗ Configuration error: {e}")
        exit(1)

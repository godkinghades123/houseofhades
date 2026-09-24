"""
House of Hades — ML Primitives (Phase-1 safe)

Lightweight, explainable Machine Learning knowledge layer.
Any resident agent (Thanatos Veyr, Helveth, Necrothys, etc.) can call
`ml_explain` to retrieve a deterministic explanation of one of the five
canonical algorithms.

No model training. No prediction. Reference + interface only.
"""

from .primitives import ml_explain, Explanation, ALGORITHMS

__all__ = ["ml_explain", "Explanation", "ALGORITHMS"]
__version__ = "0.1.0"

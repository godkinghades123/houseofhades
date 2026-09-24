"""
ML Primitives — Canonical five-algorithm reference for House of Hades agents.

Deterministic, pure functions. No training, no side effects.
"""

from __future__ import annotations

from dataclasses import dataclass, asdict
from typing import Any, Dict, List, Optional


@dataclass(frozen=True)
class Explanation:
    """Structured explanation returned by ml_explain."""

    algorithm: str
    short_description: str
    mental_model: str
    when_to_use: str
    when_not_to_use: str
    hades_translation: str
    key_idea: str
    output_shape: str

    def to_dict(self) -> Dict[str, str]:
        return asdict(self)


# ---------------------------------------------------------------------------
# Canonical knowledge base (locked to the 5-algorithm reference)
# ---------------------------------------------------------------------------

_REGISTRY: Dict[str, Explanation] = {
    "linear_regression": Explanation(
        algorithm="linear_regression",
        short_description=(
            "Predicts a continuous numeric value by fitting a straight line "
            "that minimizes the sum of squared errors between predicted and actual values."
        ),
        mental_model="Delivery time vs distance — how long will the package take given miles?",
        when_to_use=(
            "Continuous targets, roughly linear relationships, interpretability needed, "
            "baseline models, small-to-medium feature sets."
        ),
        when_not_to_use=(
            "Strongly non-linear patterns, heavy outliers without robust loss, "
            "pure classification tasks, or when interactions dominate."
        ),
        hades_translation=(
            "Engine: estimate expected move size or holding-period return from features "
            "(volatility, volume, signal strength). Content: score post engagement potential "
            "as a continuous rank. Never used for binary risk gates."
        ),
        key_idea="Best-fit line minimizing total squared error (ordinary least squares).",
        output_shape="number + optional R² / equation",
    ),
    "logistic_regression": Explanation(
        algorithm="logistic_regression",
        short_description=(
            "Binary (or multi-class) classification that outputs a calibrated probability "
            "via the sigmoid (or softmax) function, then applies a threshold for the decision."
        ),
        mental_model="SaaS churn prediction — will this customer leave next month? (yes/no + probability)",
        when_to_use=(
            "Binary or multi-class outcomes, probability calibration matters, "
            "risk flags, approval gates, spam/fraud-style decisions, linear decision boundaries."
        ),
        when_not_to_use=(
            "Highly non-linear class boundaries (prefer kernels or trees), "
            "extremely imbalanced data without class weights, or pure regression targets."
        ),
        hades_translation=(
            "Engine / risk: probability that a setup violates Phase-1 rules or hits max-loss. "
            "Agent Colony: handoff approval / rejection probability. "
            "Marketing: likelihood a draft passes pillar + highlight + hashtag gates."
        ),
        key_idea="Sigmoid maps linear score → probability 0–1 → threshold decision.",
        output_shape="probability 0–1 + class label (thresholded)",
    ),
    "decision_tree": Explanation(
        algorithm="decision_tree",
        short_description=(
            "Interpretable sequential decisions: recursive yes/no (or multi-way) splits "
            "on features until a leaf prediction is reached. Human-readable reasoning path."
        ),
        mental_model=(
            "Music playlist recommender — hip-hop? energetic? late night? → leaf playlist."
        ),
        when_to_use=(
            "Need full transparency of every decision step, mixed feature types, "
            "non-linear interactions, rule extraction, or agent handoff justification."
        ),
        when_not_to_use=(
            "Very high-dimensional sparse data without pruning, "
            "when a single global linear boundary is sufficient, or when pure probability "
            "calibration without leaves is required."
        ),
        hades_translation=(
            "Agent Colony / tool-router: explicit if-then path for why a signal routes to "
            "Thanatos Veyr vs Helveth. Engine: readable entry/exit rule trees that can be "
            "audited against ENGINE_RULES.md. Content: highlight/pillar assignment logic."
        ),
        key_idea="Recursive yes/no splits until leaf prediction; path = explanation.",
        output_shape="leaf prediction + optional decision path",
    ),
    "svm": Explanation(
        algorithm="svm",
        short_description=(
            "Maximum-margin separation of classes. Finds the hyperplane that maximizes "
            "the gap between the nearest points of different classes; kernel trick allows "
            "non-linear boundaries in the original space."
        ),
        mental_model="Iris flower petal/sepal separation — clean geometric classes in feature space.",
        when_to_use=(
            "Clean geometric separation is desirable, medium-sized datasets, "
            "high-dimensional data with clear margins, or when kernel non-linearity helps."
        ),
        when_not_to_use=(
            "Very large datasets (training cost), heavy class overlap with no margin, "
            "when probabilistic outputs are required without calibration wrappers, "
            "or when human-readable rule lists are mandatory."
        ),
        hades_translation=(
            "Engine: hard separation between valid Phase-1 setups and noise. "
            "Signal Log: margin-based confidence that a pattern belongs to a known regime. "
            "Prefer when the boundary itself is the insight, not a probability."
        ),
        key_idea="Largest-margin hyperplane; kernel trick for non-linear separation.",
        output_shape="class label + optional distance-to-margin / support vectors",
    ),
    "knn": Explanation(
        algorithm="knn",
        short_description=(
            "Similarity-based classification or regression. At prediction time, finds the "
            "k closest training points and takes majority vote (classification) or average "
            "(regression). Lazy learner — defers all work until query time."
        ),
        mental_model="Netflix genre tagging of a new title — what do the k most similar titles look like?",
        when_to_use=(
            "Local similarity is the right inductive bias, small-to-medium data, "
            "non-parametric needs, or as a simple baseline for ranking/retrieval."
        ),
        when_not_to_use=(
            "Large training sets (prediction becomes expensive), high-dimensional "
            "data without distance metrics that work, or when a compact parametric "
            "model is required for speed or deployment."
        ),
        hades_translation=(
            "Content ranking: find the k most similar past posts that performed well "
            "under the same pillar. Agent handoff: route a new request to the resident "
            "whose past successful handoffs are closest in feature space. "
            "Warning: cost grows with data size — keep reference sets small in Stage 1."
        ),
        key_idea="Majority vote (or average) of k closest training points; lazy learner.",
        output_shape="class label or continuous value + optional neighbor list",
    ),
}

# Aliases so callers can use common short names
_ALIASES: Dict[str, str] = {
    "linear": "linear_regression",
    "linreg": "linear_regression",
    "lr": "linear_regression",
    "logistic": "logistic_regression",
    "logreg": "logistic_regression",
    "logit": "logistic_regression",
    "tree": "decision_tree",
    "decision_trees": "decision_tree",
    "dt": "decision_tree",
    "support_vector_machine": "svm",
    "support_vector_machines": "svm",
    "svc": "svm",
    "k_nearest_neighbors": "knn",
    "k-nearest-neighbors": "knn",
    "nearest_neighbors": "knn",
}


ALGORITHMS: List[str] = sorted(_REGISTRY.keys())


def _normalize(name: str) -> str:
    key = name.strip().lower().replace(" ", "_").replace("-", "_")
    return _ALIASES.get(key, key)


def ml_explain(algorithm: str, context: Optional[Dict[str, Any]] = None) -> Explanation:
    """
    Single public entry point.

    Parameters
    ----------
    algorithm : str
        One of: linear_regression, logistic_regression, decision_tree, svm, knn
        (aliases accepted: linreg, logreg, tree, svc, knn, etc.)
    context : dict, optional
        Reserved for future agent-specific hints (e.g. {"domain": "engine"}).
        Currently ignored — pure lookup. Present so the signature is stable
        for tool-router / handoff callers.

    Returns
    -------
    Explanation
        Frozen dataclass with short_description, mental_model, when_to_use,
        when_not_to_use, hades_translation, key_idea, output_shape.

    Raises
    ------
    ValueError
        If the algorithm is unknown.
    """
    key = _normalize(algorithm)
    if key not in _REGISTRY:
        known = ", ".join(ALGORITHMS)
        raise ValueError(
            f"Unknown algorithm '{algorithm}'. Known: {known}. "
            f"Aliases also accepted (linreg, logreg, tree, svm, knn, ...)."
        )
    # context is accepted but intentionally unused in Phase 1 (deterministic pure)
    _ = context
    return _REGISTRY[key]


def list_algorithms() -> List[str]:
    """Return the canonical list of supported algorithm keys."""
    return list(ALGORITHMS)

"""
Unit tests for House of Hades ML Primitives.

Verifies the five canonical mental models and the public API.
"""

import pytest
from tools.ml.primitives import (
    ml_explain,
    list_algorithms,
    Explanation,
    ALGORITHMS,
)


EXPECTED_MENTAL_MODELS = {
    "linear_regression": "delivery time vs distance",
    "logistic_regression": "saas churn",
    "decision_tree": "music playlist",
    "svm": "iris flower",
    "knn": "netflix",
}


def test_all_five_algorithms_present():
    assert set(ALGORITHMS) == {
        "linear_regression",
        "logistic_regression",
        "decision_tree",
        "svm",
        "knn",
    }
    assert list_algorithms() == ALGORITHMS


def test_mental_models_match_canonical_reference():
    for algo, fragment in EXPECTED_MENTAL_MODELS.items():
        expl = ml_explain(algo)
        assert isinstance(expl, Explanation)
        assert fragment in expl.mental_model.lower(), (
            f"{algo}: expected mental model to contain '{fragment}', "
            f"got: {expl.mental_model}"
        )


def test_explanation_fields_populated():
    for algo in ALGORITHMS:
        expl = ml_explain(algo)
        assert expl.algorithm == algo
        assert expl.short_description
        assert expl.mental_model
        assert expl.when_to_use
        assert expl.when_not_to_use
        assert expl.hades_translation
        assert expl.key_idea
        assert expl.output_shape
        # HADES translation must mention at least one system surface
        lower = expl.hades_translation.lower()
        assert any(
            token in lower
            for token in ("engine", "agent", "content", "signal", "handoff", "risk", "marketing")
        ), f"{algo} hades_translation missing system mapping"


def test_aliases_resolve():
    assert ml_explain("linreg").algorithm == "linear_regression"
    assert ml_explain("logreg").algorithm == "logistic_regression"
    assert ml_explain("tree").algorithm == "decision_tree"
    assert ml_explain("svc").algorithm == "svm"
    assert ml_explain("k-nearest-neighbors").algorithm == "knn"


def test_unknown_algorithm_raises():
    with pytest.raises(ValueError) as exc:
        ml_explain("random_forest")
    assert "Unknown algorithm" in str(exc.value)


def test_context_accepted_but_ignored():
    # Signature stability for tool-router / handoff callers
    expl = ml_explain("knn", context={"domain": "engine", "caller": "Thanatos Veyr"})
    assert expl.algorithm == "knn"
    assert "Netflix" in expl.mental_model or "netflix" in expl.mental_model.lower()


def test_to_dict():
    d = ml_explain("svm").to_dict()
    assert d["algorithm"] == "svm"
    assert "iris" in d["mental_model"].lower()
    assert "hades_translation" in d


def test_explanation_is_frozen():
    expl = ml_explain("linear_regression")
    with pytest.raises(Exception):  # FrozenInstanceError
        expl.short_description = "mutated"  # type: ignore

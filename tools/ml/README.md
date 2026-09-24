# ML Primitives — House of Hades

**Phase-1 safe.** Reference + explanation layer only. No training, no prediction, no auto-trade, no publish.

Any resident agent (Thanatos Veyr, Helveth, Necrothys, tool-router, etc.) can import and call this module during handoffs.

## Location

```
tools/ml/
├── __init__.py
├── primitives.py      # core knowledge + ml_explain
├── README.md
└── tests/
    └── test_primitives.py
```

## Public API

```python
from tools.ml import ml_explain, Explanation, ALGORITHMS

# or
from tools.ml.primitives import ml_explain, list_algorithms
```

### `ml_explain(algorithm: str, context: dict | None = None) → Explanation`

| Field | Type | Description |
|-------|------|-------------|
| `algorithm` | str | Canonical key or alias |
| `short_description` | str | Plain-English what it does |
| `mental_model` | str | Canonical real-world analogy |
| `when_to_use` | str | Prefer this algorithm when… |
| `when_not_to_use` | str | Avoid when… |
| `hades_translation` | str | How it maps to Engine / Colony / Content / Risk |
| `key_idea` | str | One-line core mechanism |
| `output_shape` | str | What a real model would return |

`context` is accepted for future agent-specific hints and is currently ignored (keeps the function pure and deterministic).

### Supported algorithms

| Key | Aliases | Mental model |
|-----|---------|--------------|
| `linear_regression` | linreg, lr, linear | Delivery time vs distance |
| `logistic_regression` | logreg, logit, logistic | SaaS churn prediction |
| `decision_tree` | tree, dt | Music playlist recommender |
| `svm` | svc, support_vector_machine | Iris petal/sepal separation |
| `knn` | k-nearest-neighbors, nearest_neighbors | Netflix genre tagging |

## Example calls

```python
from tools.ml import ml_explain

# 1. Linear Regression
print(ml_explain("linear_regression").mental_model)
# → Delivery time vs distance — how long will the package take given miles?

# 2. Logistic Regression
print(ml_explain("logreg").hades_translation)
# → Engine / risk: probability that a setup violates Phase-1 rules ...

# 3. Decision Tree
expl = ml_explain("decision_tree", context={"caller": "Thanatos Veyr"})
print(expl.when_to_use)

# 4. SVM
print(ml_explain("svm").key_idea)
# → Largest-margin hyperplane; kernel trick for non-linear separation.

# 5. KNN
print(ml_explain("knn").when_not_to_use)
```

## Tests

From repo root (or with `PYTHONPATH` including the parent of `tools`):

```bash
python -m pytest tools/ml/tests/ -v
```

## Design constraints (locked)

- Deterministic and pure — no I/O, no training, no random state.
- Single entry point so tool-router and handoff_runner can call it uniformly.
- HADES translation is mandatory so every explanation is immediately actionable inside the colony.
- Phase-1 safe: never suggests live trades or auto-publish.

## Suggested next steps

1. Wire `ml_explain` into the tool-router capability registry (`agent.registry`).
2. Surface a read-only “ML Primitives” strip on the Agent Colony view (Ops Dashboard).
3. Later: optional thin adapters that call real sklearn / statsmodels models behind the same interface, still gated by Phase-1 rules.

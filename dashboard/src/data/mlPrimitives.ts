/**
 * ML Primitives — static snapshot for Agent Colony strip
 * Source of truth: tools/ml/primitives.py (ml_explain)
 * Phase-1 safe: explain only. No training. No prediction.
 */

export interface MlPrimitive {
  key: string
  label: string
  mentalModel: string
  hadesUse: string
}

export const ML_PRIMITIVES: MlPrimitive[] = [
  {
    key: 'linear_regression',
    label: 'Linear Regression',
    mentalModel: 'Delivery time vs distance',
    hadesUse: 'Engine continuous estimates · content engagement rank',
  },
  {
    key: 'logistic_regression',
    label: 'Logistic Regression',
    mentalModel: 'SaaS churn prediction',
    hadesUse: 'Phase-1 risk probability · handoff / gate approval',
  },
  {
    key: 'decision_tree',
    label: 'Decision Tree',
    mentalModel: 'Music playlist recommender',
    hadesUse: 'Readable tool-router paths · Engine rule trees',
  },
  {
    key: 'svm',
    label: 'SVM',
    mentalModel: 'Iris petal / sepal separation',
    hadesUse: 'Hard separation valid Phase-1 setups vs noise',
  },
  {
    key: 'knn',
    label: 'KNN',
    mentalModel: 'Netflix genre tagging',
    hadesUse: 'Similar-post ranking · closest successful resident',
  },
]

export const ML_MODULE_PATH = 'tools/ml/primitives.py'
export const ML_CAPABILITY = 'ml.explain'
export const ML_OWNER = 'Thanatos Veyr · Tartarus'

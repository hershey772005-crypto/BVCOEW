cd C:\Users\aradh\Desktop\BVCOEW\study-pattern-classifier\model

pip install -r requirements.txt

python train.py

copy model_config.json ..\public\

cd ..

npm run dev

----------------------------------------------------------------------------

I'll explain each function in the `train.py` file in detail:

## **1. `load_data()`**
Loads the study data from a CSV file.

- **Path**: Looks for `sample.csv` in the `public` folder relative to the script location
- **Returns**: A pandas DataFrame with student study records
- **Output**: Prints the number of students loaded and column names for debugging

---

## **2. `extract_features(df)`**
Extracts temporal distribution features from raw study data. Instead of just using total hours, it analyzes *how* study time is distributed across days.

**Features extracted:**
- **`pi` (Procrastination Index)**: Proportion of study in the last 40% of days (0 to 1). Higher = more procrastination
- **`ei` (Early Bird Index)**: Proportion of study in the first 40% of days. Higher = starts early
- **`std`**: Standard deviation of daily study hours (measures consistency)
- **`cv` (Coefficient of Variation)**: Normalized variability (std / mean). Higher = more inconsistent
- **`slope`**: Last day hours minus first day hours (shows trend direction)
- **`peak_day`**: Which day had the most study time (0-indexed)
- **`trend`**: Linear regression slope (positive = increasing over time, negative = decreasing)
- **`total`**: Total study hours across all days

**Returns**: DataFrame with one row per student containing these 8 features

---

## **3. `discover_patterns(features_df)`**
Uses K-Means clustering to automatically discover 3 natural study patterns without using hardcoded rules.

**Process:**
1. Select 4 key features: `pi`, `cv`, `trend`, `std`
2. Normalize them using StandardScaler (ensures all features have equal weight)
3. Run K-Means with 3 clusters
4. **Assign pattern names based on cluster characteristics:**
   - **Consistent**: Cluster with lowest `cv` (most uniform distribution)
   - **Last-minute**: Remaining cluster with highest `pi` (most end-heavy)
   - **Irregular**: Whatever cluster is left
5. Prints cluster statistics and pattern distribution

**Returns**: 
- Updated DataFrame with `cluster` and `pattern` columns
- `scaler`: StandardScaler object (needed later)
- `cluster_features`: List of feature names used

---

## **4. `train_decision_tree(features_df)`**
Trains a shallow Decision Tree to learn explainable classification rules.

**Features used**: `pi`, `std`, `cv`, `trend`

**Tree configuration:**
- `max_depth=4`: Keeps tree shallow (easier to interpret)
- `min_samples_leaf=10`: Requires at least 10 samples per leaf (avoids overfitting)

**Process:**
1. Trains on engineered features with cluster-assigned patterns as labels
2. Evaluates using 5-fold cross-validation (tests on held-out data)
3. Prints the decision tree rules in text format (shows conditions like "if pi > 0.6 then...")

**Returns**: 
- `clf`: Trained DecisionTreeClassifier object
- `feature_cols`: List of feature names used

---

## **5. `export_model(clf, feature_cols, features_df)`**
Converts the trained model into a JSON configuration file for the frontend to use.

**Computes:**
- **Thresholds**: Derived from data quantiles to classify new students
  - Consistent: cv and std upper bounds (75th percentile)
  - Last-minute: pi and trend lower bounds (25th percentile)
- **Pattern statistics**: For each pattern, stores mean and std of key features
- **Metadata**: Training samples, model type, cross-validation accuracy

**Returns**: Dictionary with model configuration

**Output**: Saves `model_config.json` in the model folder for the frontend to use

---

## **6. `export_labeled_data(df, features_df)`**
Creates a CSV file with the original data plus all computed features and assigned patterns.

**Includes:**
- Original columns (raw study hours per day)
- `pattern`: The assigned pattern (Consistent/Irregular/Last-minute)
- Calculated features: `pi`, `std`, `cv`, `trend` (rounded for readability)

**Output**: Saves `labeled_data.csv` for verification and analysis

---

## **7. `main()`**
Orchestrates the entire pipeline in sequence:

1. **Load** → Reads student data
2. **Extract** → Computes temporal features
3. **Discover** → Clusters into 3 patterns
4. **Train** → Builds decision tree classifier
5. **Export** → Saves model as JSON
6. **Export** → Saves labeled dataset

**Purpose**: Creates both the model configuration (for the frontend) and a labeled dataset (for validation)

---

**Overall Flow**: Raw data → Features → Patterns → Explainable rules → JSON configs for frontend use
"""
Study Pattern Classifier - Model Training Pipeline
Uses K-Means clustering to discover patterns, then trains a Decision Tree for explainable classification.
"""

import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.tree import DecisionTreeClassifier, export_text
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
import json
import os

# Get the directory where this script is located
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

def load_data():
    """Load the study data CSV"""
    csv_path = os.path.join(PROJECT_ROOT, 'public', 'sample.csv')
    df = pd.read_csv(csv_path)
    print(f"Loaded {len(df)} students")
    print(f"Columns: {list(df.columns)}")
    return df

def extract_features(df):
    """
    Extract temporal distribution features from study data.
    These features capture HOW study time is distributed, not just totals.
    """
    features = []
    
    for idx, row in df.iterrows():
        days = row.values[:5].astype(float)
        total = np.sum(days)
        
        # Procrastination Index: proportion of study in last 2 days
        pi = (days[3] + days[4]) / total if total > 0 else 0
        
        # Early Bird Index: proportion in first 2 days
        ei = (days[0] + days[1]) / total if total > 0 else 0
        
        # Standard Deviation: measures consistency
        std = np.std(days)
        
        # Coefficient of Variation: normalized variability
        cv = std / np.mean(days) if np.mean(days) > 0 else 0
        
        # Slope: trend from first to last day
        slope = days[4] - days[0]
        
        # Peak day (0-4)
        peak_day = np.argmax(days)
        
        # Trend: linear regression slope
        x = np.arange(5)
        trend = np.polyfit(x, days, 1)[0] if total > 0 else 0
        
        features.append({
            'pi': pi,           # Procrastination Index
            'ei': ei,           # Early Index
            'std': std,         # Standard Deviation
            'cv': cv,           # Coefficient of Variation
            'slope': slope,     # Day5 - Day1
            'peak_day': peak_day,
            'trend': trend,     # Linear trend
            'total': total
        })
    
    return pd.DataFrame(features)

def discover_patterns(features_df):
    """
    Use K-Means clustering to discover natural study patterns.
    We use 3 clusters to match: Consistent, Irregular, Last-minute
    """
    # Select features for clustering (exclude total - we focus on distribution)
    cluster_features = ['pi', 'cv', 'trend', 'std']
    X = features_df[cluster_features].values
    
    # Normalize features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # K-Means with 3 clusters
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(X_scaled)
    
    # Analyze clusters to assign pattern names
    features_df['cluster'] = clusters
    
    # Compute cluster characteristics
    cluster_stats = features_df.groupby('cluster').agg({
        'pi': 'mean',
        'cv': 'mean',
        'std': 'mean',
        'trend': 'mean'
    }).round(3)
    
    print("\n=== Cluster Analysis ===")
    print(cluster_stats)
    
    # Assign pattern names based on cluster characteristics
    pattern_map = {}
    for cluster_id in range(3):
        stats = cluster_stats.loc[cluster_id]
        
        if stats['cv'] < 0.5 and stats['std'] < 25:
            pattern_map[cluster_id] = 'Consistent'
        elif stats['pi'] > 0.45 and stats['trend'] > 5:
            pattern_map[cluster_id] = 'Last-minute'
        else:
            pattern_map[cluster_id] = 'Irregular'
    
    # Handle edge case: ensure all 3 patterns are assigned
    assigned = set(pattern_map.values())
    if len(assigned) < 3:
        # Force assignment based on ranking
        cv_rank = cluster_stats['cv'].argsort()
        pi_rank = cluster_stats['pi'].argsort()
        
        pattern_map[cv_rank.values[0]] = 'Consistent'  # Lowest CV
        pattern_map[pi_rank.values[2]] = 'Last-minute'  # Highest PI
        for c in range(3):
            if c not in [cv_rank.values[0], pi_rank.values[2]]:
                pattern_map[c] = 'Irregular'
    
    features_df['pattern'] = features_df['cluster'].map(pattern_map)
    
    print("\n=== Pattern Distribution ===")
    print(features_df['pattern'].value_counts())
    
    return features_df, scaler, cluster_features

def train_decision_tree(features_df):
    """
    Train a Decision Tree classifier for explainable rules.
    The tree learns from the cluster assignments.
    """
    # Features for classification
    feature_cols = ['pi', 'std', 'cv', 'trend']
    X = features_df[feature_cols].values
    y = features_df['pattern'].values
    
    # Train Decision Tree (keep it shallow for explainability)
    clf = DecisionTreeClassifier(
        max_depth=4,
        min_samples_leaf=10,
        random_state=42
    )
    clf.fit(X, y)
    
    # Cross-validation score
    scores = cross_val_score(clf, X, y, cv=5)
    print(f"\n=== Decision Tree Performance ===")
    print(f"Cross-validation accuracy: {scores.mean():.2f} (+/- {scores.std()*2:.2f})")
    
    # Print decision rules
    print("\n=== Decision Tree Rules ===")
    rules = export_text(clf, feature_names=feature_cols)
    print(rules)
    
    return clf, feature_cols

def export_model(clf, feature_cols, features_df):
    """Export model rules as JSON for frontend use"""
    
    # Get thresholds from the trained tree
    tree = clf.tree_
    
    # Compute statistics for each pattern
    pattern_stats = {}
    for pattern in ['Consistent', 'Irregular', 'Last-minute']:
        mask = features_df['pattern'] == pattern
        pattern_stats[pattern] = {
            'count': int(mask.sum()),
            'pi_mean': float(features_df.loc[mask, 'pi'].mean()),
            'pi_std': float(features_df.loc[mask, 'pi'].std()),
            'std_mean': float(features_df.loc[mask, 'std'].mean()),
            'cv_mean': float(features_df.loc[mask, 'cv'].mean()),
            'trend_mean': float(features_df.loc[mask, 'trend'].mean()),
        }
    
    # Derive classification thresholds from data
    model_config = {
        'features': feature_cols,
        'thresholds': {
            'consistent': {
                'cv_max': float(features_df[features_df['pattern'] == 'Consistent']['cv'].quantile(0.75)),
                'std_max': float(features_df[features_df['pattern'] == 'Consistent']['std'].quantile(0.75)),
            },
            'last_minute': {
                'pi_min': float(features_df[features_df['pattern'] == 'Last-minute']['pi'].quantile(0.25)),
                'trend_min': float(features_df[features_df['pattern'] == 'Last-minute']['trend'].quantile(0.25)),
            }
        },
        'pattern_stats': pattern_stats,
        'training_samples': len(features_df),
        'model_type': 'DecisionTree',
        'accuracy': float(cross_val_score(clf, 
            features_df[feature_cols].values, 
            features_df['pattern'].values, cv=5).mean())
    }
    
    # Save to JSON
    output_path = os.path.join(SCRIPT_DIR, 'model_config.json')
    with open(output_path, 'w') as f:
        json.dump(model_config, f, indent=2)
    
    print(f"\n=== Model Exported ===")
    print(f"Saved to: {output_path}")
    print(json.dumps(model_config, indent=2))
    
    return model_config

def export_labeled_data(df, features_df):
    """Export the dataset with assigned labels for verification"""
    output_df = df.copy()
    output_df['pattern'] = features_df['pattern']
    output_df['pi'] = features_df['pi'].round(3)
    output_df['std'] = features_df['std'].round(2)
    output_df['cv'] = features_df['cv'].round(3)
    output_df['trend'] = features_df['trend'].round(2)
    
    output_path = os.path.join(SCRIPT_DIR, 'labeled_data.csv')
    output_df.to_csv(output_path, index=False)
    print(f"Labeled data saved to: {output_path}")

def main():
    print("=" * 50)
    print("Study Pattern Classifier - Training Pipeline")
    print("=" * 50)
    
    # Step 1: Load data
    df = load_data()
    
    # Step 2: Extract features
    print("\n>>> Extracting temporal features...")
    features_df = extract_features(df)
    print(features_df.describe().round(3))
    
    # Step 3: Discover patterns via clustering
    print("\n>>> Discovering patterns via K-Means clustering...")
    features_df, scaler, cluster_features = discover_patterns(features_df)
    
    # Step 4: Train Decision Tree for explainable classification
    print("\n>>> Training Decision Tree classifier...")
    clf, feature_cols = train_decision_tree(features_df)
    
    # Step 5: Export model
    print("\n>>> Exporting model configuration...")
    model_config = export_model(clf, feature_cols, features_df)
    
    # Step 6: Export labeled data
    print("\n>>> Exporting labeled dataset...")
    export_labeled_data(df, features_df)
    
    print("\n" + "=" * 50)
    print("Training complete!")
    print("=" * 50)

if __name__ == "__main__":
    main()

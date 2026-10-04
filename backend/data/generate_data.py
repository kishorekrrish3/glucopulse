import numpy as np
import pandas as pd
from datetime import datetime, timedelta

def generate_alex_metabolic_dataset(num_records=180, seed=42):
    """
    Generates realistic 60-day continuous metabolic & meal history for Alex.
    Reflects pre-diabetic metabolic dynamics:
    - High glycemic load triggers amplified insulin response delays and higher peaks.
    - Fiber and protein blunt absorption rate.
    - Fats delay the peak (the 'pizza effect' / biphasic curve).
    - Sleep deprivation (< 6h) increases insulin resistance, raising peak by 10-25 mg/dL.
    - Post-meal walking activates non-insulin-mediated GLUT4 glucose transport, dropping peak by 15-35 mg/dL.
    """
    np.random.seed(seed)
    
    meals_catalog = [
        {"name": "Steel Cut Oatmeal with Berries & Honey", "type": "Breakfast", "carbs": 55, "fiber": 7, "protein": 10, "fat": 6, "gi": 55},
        {"name": "Bagel with Cream Cheese", "type": "Breakfast", "carbs": 68, "fiber": 2, "protein": 11, "fat": 14, "gi": 72},
        {"name": "Eggs & Avocado on Whole Grain Toast", "type": "Breakfast", "carbs": 24, "fiber": 8, "protein": 18, "fat": 20, "gi": 40},
        {"name": "Greek Yogurt with Chia Seeds & Walnuts", "type": "Breakfast", "carbs": 14, "fiber": 6, "protein": 22, "fat": 18, "gi": 25},
        {"name": "Protein Whey Shake with Almond Milk", "type": "Breakfast", "carbs": 6, "fiber": 3, "protein": 30, "fat": 5, "gi": 20},
        {"name": "Pancakes with Maple Syrup & Butter", "type": "Breakfast", "carbs": 85, "fiber": 2, "protein": 8, "fat": 16, "gi": 80},
        
        {"name": "Chicken Quinoa Bowl with Spinach", "type": "Lunch", "carbs": 42, "fiber": 8, "protein": 36, "fat": 14, "gi": 45},
        {"name": "Spicy Thai Drunken Noodles (Pad Kee Mao)", "type": "Lunch", "carbs": 88, "fiber": 3, "protein": 22, "fat": 24, "gi": 75},
        {"name": "Mediterranean Caesar Salad with Grilled Chicken", "type": "Lunch", "carbs": 12, "fiber": 5, "protein": 38, "fat": 22, "gi": 30},
        {"name": "Turkey & Cheddar Sub Sandwich", "type": "Lunch", "carbs": 58, "fiber": 3, "protein": 28, "fat": 18, "gi": 68},
        {"name": "Chipotle Burrito Bowl with Brown Rice & Beans", "type": "Lunch", "carbs": 65, "fiber": 12, "protein": 35, "fat": 20, "gi": 52},
        {"name": "Sushi Bento (Spicy Tuna Roll & White Rice)", "type": "Lunch", "carbs": 76, "fiber": 2, "protein": 20, "fat": 12, "gi": 78},

        {"name": "Grilled Salmon with Asparagus & Sweet Potato", "type": "Dinner", "carbs": 32, "fiber": 6, "protein": 42, "fat": 18, "gi": 45},
        {"name": "Two Slices Pepperoni Pizza", "type": "Dinner", "carbs": 72, "fiber": 3, "protein": 24, "fat": 30, "gi": 70},
        {"name": "Grass-fed Ribeye Steak with Roasted Broccoli", "type": "Dinner", "carbs": 8, "fiber": 5, "protein": 48, "fat": 32, "gi": 20},
        {"name": "Tofu Veggie Stir-Fry with Jasmine Rice", "type": "Dinner", "carbs": 64, "fiber": 5, "protein": 20, "fat": 12, "gi": 72},
        {"name": "Lentil Soup with Sourdough Bread", "type": "Dinner", "carbs": 54, "fiber": 11, "protein": 22, "fat": 8, "gi": 48},
        {"name": "Cheeseburger with French Fries", "type": "Dinner", "carbs": 82, "fiber": 4, "protein": 30, "fat": 38, "gi": 75},
        
        {"name": "Handful of Almonds & Dark Chocolate 85%", "type": "Snack", "carbs": 10, "fiber": 4, "protein": 6, "fat": 15, "gi": 25},
        {"name": "Apple Slices with Peanut Butter", "type": "Snack", "carbs": 26, "fiber": 6, "protein": 8, "fat": 16, "gi": 38},
        {"name": "Bag of Potato Chips & Soda", "type": "Snack", "carbs": 60, "fiber": 1, "protein": 3, "fat": 15, "gi": 85},
    ]

    base_time = datetime.now() - timedelta(days=60)
    records = []

    for i in range(num_records):
        meal_info = meals_catalog[np.random.choice(len(meals_catalog))]
        
        day_offset = i // 3
        meal_idx = i % 3
        if meal_idx == 0:
            hour = np.random.randint(7, 10)
        elif meal_idx == 1:
            hour = np.random.randint(12, 14)
        else:
            hour = np.random.randint(18, 21)
            
        timestamp = base_time + timedelta(days=day_offset, hours=hour, minutes=np.random.randint(0, 59))
        
        # Variations in portion
        portion_multiplier = np.random.uniform(0.85, 1.25)
        carbs = round(meal_info["carbs"] * portion_multiplier, 1)
        fiber = round(meal_info["fiber"] * portion_multiplier, 1)
        protein = round(meal_info["protein"] * portion_multiplier, 1)
        fat = round(meal_info["fat"] * portion_multiplier, 1)
        gi = meal_info["gi"]
        net_carbs = max(1.0, round(carbs - fiber, 1))
        gl = round((gi * carbs) / 100.0, 1)

        # Baseline glucose for Alex (ranges 88 to 118 mg/dL)
        pre_meal_glucose = round(np.random.normal(98, 7), 1)
        pre_meal_glucose = max(84.0, min(128.0, pre_meal_glucose))

        # Sleep hours previous night (4.5 to 8.5)
        sleep_hours = round(np.random.choice([5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0], p=[0.1, 0.15, 0.25, 0.25, 0.15, 0.05, 0.05]), 1)

        # Stress level 1-5
        stress_level = int(np.random.choice([1, 2, 3, 4, 5], p=[0.2, 0.35, 0.25, 0.15, 0.05]))

        # Post meal walk minutes (frequently 0, sometimes 10-30 min)
        walk_min = int(np.random.choice([0, 10, 15, 20, 30], p=[0.45, 0.2, 0.2, 0.1, 0.05]))

        # Physiological response model
        # Base spike from net carbs and glycemic load
        raw_spike = (gl * 0.95) + (net_carbs * 0.45)
        
        # Blunting effects from fiber, protein, and fat
        fiber_blunt = min(18.0, fiber * 1.4)
        protein_blunt = min(14.0, protein * 0.25)
        fat_blunt = min(10.0, fat * 0.18)
        
        # Sleep deprivation penalty
        sleep_penalty = max(0.0, (7.0 - sleep_hours) * 4.5)
        
        # Stress penalty
        stress_penalty = (stress_level - 1) * 3.2
        
        # Post meal walking benefit (GLUT4 uptake)
        walk_benefit = min(32.0, walk_min * 0.95)

        # Random biological variance
        noise = np.random.normal(0, 3.5)

        net_rise = max(8.0, raw_spike - fiber_blunt - protein_blunt - fat_blunt + sleep_penalty + stress_penalty - walk_benefit + noise)
        peak_glucose = round(pre_meal_glucose + net_rise, 1)

        # Time to peak (fat delays peak; high GI peaks faster)
        base_ttp = 45.0 + (fat * 0.6) - (gi * 0.15) + np.random.normal(0, 4)
        time_to_peak_min = int(max(30, min(105, round(base_ttp))))

        # Clearance time
        clearance_base = 75.0 + (net_rise * 0.9) - (walk_min * 0.8) + np.random.normal(0, 8)
        clearance_time_min = int(max(45, min(220, round(clearance_base))))

        # Category
        if peak_glucose < 120.0:
            category = "Normal"
        elif peak_glucose <= 140.0:
            category = "Elevated"
        else:
            category = "Severe Spike"

        records.append({
            "meal_id": f"ML-{i+1:04d}",
            "meal_name": meal_info["name"],
            "timestamp": timestamp.strftime("%Y-%m-%d %H:%M"),
            "meal_type": meal_info["type"],
            "carbs_g": carbs,
            "fiber_g": fiber,
            "net_carbs_g": net_carbs,
            "protein_g": protein,
            "fat_g": fat,
            "glycemic_index": gi,
            "glycemic_load": gl,
            "pre_meal_glucose": pre_meal_glucose,
            "sleep_hours": sleep_hours,
            "stress_level": stress_level,
            "post_meal_walk_min": walk_min,
            "meal_time_hour": hour,
            "peak_glucose": peak_glucose,
            "time_to_peak_min": time_to_peak_min,
            "spike_category": category,
            "clearance_time_min": clearance_time_min
        })

    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    df = generate_alex_metabolic_dataset()
    df.to_csv("backend/data/alex_metabolic_history.csv", index=False)
    print(f"Generated {len(df)} realistic metabolic logs for Alex at backend/data/alex_metabolic_history.csv")
    print(df[["meal_name", "net_carbs_g", "post_meal_walk_min", "pre_meal_glucose", "peak_glucose", "spike_category"]].head(8))

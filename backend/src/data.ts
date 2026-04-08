export const ARRIVAL_PROBS: Record<number, number> = {
    0: 0.0094,
    1: 0.0094,
    2: 0.0094,
    3: 0.0094,
    4: 0.0094,
    5: 0.0094,
    6: 0.0094,
    7: 0.0094,
    8: 0.0283,
    9: 0.0283,
    10: 0.0566,
    11: 0.0566,
    12: 0.0566,
    13: 0.0755,
    14: 0.0755,
    15: 0.0755,
    16: 0.1038,
    17: 0.1038,
    18: 0.1038,
    19: 0.0472,
    20: 0.0472,
    21: 0.0472,
    22: 0.0094,
    23: 0.0094
};

export const CHARGING_PROBS = [
    { prob: 0.3431, km: 0 },
    { prob: 0.049, km: 5 },
    { prob: 0.098, km: 10 },
    { prob: 0.1176, km: 20 },
    { prob: 0.0882, km: 30 },
    { prob: 0.1176, km: 50 },
    { prob: 0.1078, km: 100 },
    { prob: 0.0490, km: 200 },
    { prob: 0.0294, km: 300 }
];

export const CONSUMPTION_KWH = 18;
export const CHARGING_POWER_KW = 11;
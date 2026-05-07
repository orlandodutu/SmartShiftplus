from flask import Flask, jsonify, request
from flask_cors import CORS
from pulp import *
import os

app = Flask(__name__)
CORS(app)

# --- CONFIGURAZIONE PERSONALE ---
STAFF = [
    {"name": "Orlando", "role": "AUS", "fixed_mornings": True, "fixed_sun_off": True},
    {"name": "Anna", "role": "INF", "fixed_mornings": True, "alt_weekends": True},
    {"name": "Roberto", "role": "OSS"},
    {"name": "Stefania2", "role": "OSS"},
    {"name": "Stefania", "role": "OSS"},
    {"name": "Barbara", "role": "OSS", "night_shift": True},
    {"name": "Carmen", "role": "OSS", "night_shift": True},
    {"name": "Elena", "role": "OSS", "night_shift": True},
    {"name": "Vittoria", "role": "OSS"},
    {"name": "Fabiana", "role": "AUS"},
    {"name": "Angela", "role": "AUS"},
    {"name": "Marina", "role": "AUS"},
]

SHIFTS = ['M', 'P', 'N', 'R'] # Mattina, Pomeriggio, Notte, Riposo

@app.route('/generate', methods=['GET'])
def generate_schedule():
    days = 30 # Generiamo per un mese
    prob = LpProblem("Turni_RSA", LpMinimize)
    
    # Variabile decisionale: x[persona, giorno, turno] = 1 se lavora
    x = LpVariable.dicts("shift", (range(len(STAFF)), range(days), SHIFTS), 0, 1, LpBinary)

    for d in range(days):
        # --- VINCOLI COPERTURA ---
        # Mattina: 3 OSS, 2 AUS (Orlando + 1), 1 INF (Anna)
        prob += lpSum([x[i][d]['M'] for i, s in enumerate(STAFF) if s['role'] == 'OSS']) >= 3
        prob += lpSum([x[i][d]['M'] for i, s in enumerate(STAFF) if s['role'] == 'AUS']) >= 2
        prob += lpSum([x[i][d]['M'] for i, s in enumerate(STAFF) if s['role'] == 'INF']) == 1

        # Pomeriggio: Almeno 2 OSS (se avanzano, fino a 4)
        prob += lpSum([x[i][d]['P'] for i, s in enumerate(STAFF) if s['role'] == 'OSS']) >= 2
        
        # Notte: Esattamente 1 OSS (Elena, Carmen o Barbara)
        prob += lpSum([x[i][d]['N'] for i, s in enumerate(STAFF) if s.get('night_shift')]) == 1
        
        # Le AUS non lavorano pomeriggio o notte
        for i, s in enumerate(STAFF):
            if s['role'] == 'AUS':
                prob += x[i][d]['P'] == 0
                prob += x[i][d]['N'] == 0

    for i, s in enumerate(STAFF):
        # --- VINCOLI INDIVIDUALI ---
        # Orlando: Solo Mattina e Domenica sempre Riposo (6, 13, 20, 27)
        if s['name'] == "Orlando":
            for d in range(days):
                if d % 7 == 6: prob += x[i][d]['R'] == 1
                else: prob += x[i][d]['M'] == 1

        # Anna: Solo Mattina, Sabato/Domenica alternati
        if s['name'] == "Anna":
            for d in range(days):
                prob += x[i][d]['P'] == 0
                prob += x[i][d]['N'] == 0

        # Riposo settimanale per tutti
        for w in range(days // 7):
            prob += lpSum([x[i][d]['R'] for d in range(w*7, (w+1)*7)]) >= 1

        # No Notte -> Mattina il giorno dopo (Riposo minimo 11h)
        for d in range(days - 1):
            prob += x[i][d]['N'] + x[i][d+1]['M'] <= 1

    # Risoluzione
    prob.solve(PULP_CBC_CMD(msg=0))
    
    # Costruzione Risposta
    result = []
    for d in range(days):
        day_shifts = {"day": d + 1, "shifts": {}}
        for i, s in enumerate(STAFF):
            for sh in SHIFTS:
                if value(x[i][d][sh]) == 1:
                    day_shifts["shifts"][s['name']] = sh
        result.append(day_shifts)

    return jsonify(result)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", "5000"))
    try:
        from waitress import serve

        serve(app, host="0.0.0.0", port=port)
    except Exception:
        app.run(debug=True, port=port)
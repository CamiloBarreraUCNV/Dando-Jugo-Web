import zipfile
import xml.etree.ElementTree as ET
import json
import os
import unicodedata

wb_path = 'assets/Dando Jugo Tarjetas.xlsx'
target_dirs = ['data', 'src/data']

for d in target_dirs:
    os.makedirs(d, exist_ok=True)

def strip_accents(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn').lower().strip()

with zipfile.ZipFile(wb_path, 'r') as z:
    shared_strings = []
    if 'xl/sharedStrings.xml' in z.namelist():
        ss_root = ET.fromstring(z.read('xl/sharedStrings.xml'))
        for si in ss_root.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}si'):
            text = ''.join(t.text for t in si.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t') if t.text)
            shared_strings.append(text)

    wb_root = ET.fromstring(z.read('xl/workbook.xml'))
    sheets = wb_root.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheets')
    rels_root = ET.fromstring(z.read('xl/_rels/workbook.xml.rels'))
    rel_map = {r.attrib['Id']: r.attrib['Target'] for r in rels_root}

    def get_sheet_rows_dict(name):
        for s in sheets:
            if s.attrib['name'] == name:
                r_id = s.attrib['{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id']
                target = rel_map[r_id]
                sheet_path = 'xl/' + target if not target.startswith('xl/') else target
                sheet_root = ET.fromstring(z.read(sheet_path))
                rows = sheet_root.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}row')
                
                parsed_rows = []
                for r in rows:
                    col_vals = {}
                    for c in r.findall('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}c'):
                        ref = ''.join([ch for ch in c.attrib.get('r', '') if ch.isalpha()])
                        t = c.attrib.get('t')
                        v = c.find('{http://schemas.openxmlformats.org/spreadsheetml/2006/main}v')
                        val = v.text if v is not None else ''
                        if t == 's' and val.isdigit():
                            val = shared_strings[int(val)]
                        col_vals[ref] = val
                    if any(str(v).strip() for v in col_vals.values()):
                        parsed_rows.append(col_vals)
                return parsed_rows
        return []

    def to_num_or_str(v):
        v_str = str(v).strip()
        if not v_str:
            return None
        try:
            f = float(v_str)
            if f.is_integer():
                return int(f)
            return f
        except ValueError:
            return v_str

    # 1. TRIVIA
    tr_rows = get_sheet_rows_dict('Trivia')
    # Build header map
    header_tr = tr_rows[0]
    col_map_tr = {strip_accents(v): k for k, v in header_tr.items()}
    
    trivia_data = []
    for r in tr_rows[1:]:
        q = r.get(col_map_tr.get('descripcion', 'B'), '').strip()
        if not q:
            continue
        trivia_data.append({
            "id": to_num_or_str(r.get(col_map_tr.get('id', 'A'), '')),
            "pregunta": q,
            "castigo": r.get(col_map_tr.get('castigo', 'C'), '').strip() or None,
            "dificultad": to_num_or_str(r.get(col_map_tr.get('dificultad 1/10', 'D'), '')),
            "categoria": r.get(col_map_tr.get('categoria', 'E'), '').strip() or "General",
            "opciones": {
                "A": str(to_num_or_str(r.get(col_map_tr.get('alt. a', 'F'), '')) or '').strip(),
                "B": str(to_num_or_str(r.get(col_map_tr.get('alt. b', 'G'), '')) or '').strip(),
                "C": str(to_num_or_str(r.get(col_map_tr.get('alt. c', 'H'), '')) or '').strip(),
                "D": str(to_num_or_str(r.get(col_map_tr.get('alt. d', 'I'), '')) or '').strip()
            },
            "correcta": str(to_num_or_str(r.get(col_map_tr.get('correcta', 'J'), '')) or '').strip(),
            "aprobado_diego": r.get(col_map_tr.get('aprobacion diego', 'K'), '').strip() or None,
            "observacion": r.get(col_map_tr.get('observacion', 'L'), '').strip() or None
        })

    # 2. MINIJUEGOS
    mj_rows = get_sheet_rows_dict('Minijuegos')
    header_mj = mj_rows[0]
    col_map_mj = {strip_accents(v): k for k, v in header_mj.items()}

    minijuegos_data = []
    for r in mj_rows[1:]:
        titulo = r.get(col_map_mj.get('titulo', 'B'), '').strip()
        desc = r.get(col_map_mj.get('descripcion', 'C'), '').strip()
        if not titulo and not desc:
            continue
        minijuegos_data.append({
            "id": to_num_or_str(r.get(col_map_mj.get('id', 'A'), '')),
            "titulo": titulo or "¿Quién es más Probable?",
            "descripcion": desc,
            "castigo": r.get(col_map_mj.get('castigo', 'D'), '').strip() or None,
            "dificultad": to_num_or_str(r.get(col_map_mj.get('dificultad 1/10', 'E'), '')),
            "categoria": r.get(col_map_mj.get('categoria', ''), '').strip() or None,
            "aprobado_diego": r.get(col_map_mj.get('aprobacion diego', 'F'), '').strip() or None,
            "observacion": r.get(col_map_mj.get('observacion', 'G'), '').strip() or None
        })

    # 3. JUGO
    jg_rows = get_sheet_rows_dict('Jugo')
    header_jg = jg_rows[0]
    col_map_jg = {strip_accents(v): k for k, v in header_jg.items()}

    jugo_data = []
    for r in jg_rows[1:]:
        titulo = r.get(col_map_jg.get('titulo', 'B'), '').strip()
        desc = r.get(col_map_jg.get('descripcion', 'C'), '').strip()
        if not titulo and not desc:
            continue
        jugo_data.append({
            "id": to_num_or_str(r.get(col_map_jg.get('id', 'A'), '')),
            "titulo": titulo,
            "descripcion": desc,
            "castigo": r.get(col_map_jg.get('castigo', 'D'), '').strip() or None,
            "dificultad": to_num_or_str(r.get(col_map_jg.get('dificultad 1/10', 'E'), '')),
            "categoria": r.get(col_map_jg.get('categoria', ''), '').strip() or None,
            "aprobado_diego": r.get(col_map_jg.get('aprobacion diego', 'F'), '').strip() or None,
            "observacion": r.get(col_map_jg.get('observacion', 'G'), '').strip() or None
        })

    # 4. HOJA 7 (Reto / Toman Todos)
    h7_rows = get_sheet_rows_dict('Hoja 7')
    header_h7 = h7_rows[0]
    col_map_h7 = {strip_accents(v): k for k, v in header_h7.items()}

    hoja7_data = []
    for r in h7_rows[1:]:
        titulo = r.get(col_map_h7.get('titulo', 'B'), '').strip()
        desc = r.get(col_map_h7.get('descripcion', 'C'), '').strip()
        if not titulo and not desc:
            continue
        hoja7_data.append({
            "id": to_num_or_str(r.get(col_map_h7.get('id', 'A'), '')),
            "titulo": titulo,
            "descripcion": desc,
            "castigo": r.get(col_map_h7.get('castigo', 'D'), '').strip() or None,
            "dificultad": to_num_or_str(r.get(col_map_h7.get('dificultad 1/10', 'E'), '')),
            "categoria": r.get(col_map_h7.get('categoria', 'F'), '').strip() or None,
            "aprobado_diego": r.get(col_map_h7.get('aprobacion diego', 'G'), '').strip() or None,
            "observacion": r.get(col_map_h7.get('observacion', 'H'), '').strip() or None
        })

    # 5. VARIABLES
    var_rows = get_sheet_rows_dict('Variables')
    variables_dict = {}
    for r in var_rows[1:]:
        v_name = r.get('A', '').strip()
        v_val = to_num_or_str(r.get('B', ''))
        if v_name:
            variables_dict[v_name] = v_val

    # 6. DANDO JUGO (MODOS ACTUALIZADOS)
    dj_rows = get_sheet_rows_dict('Dando Jugo')
    header_dj = dj_rows[0]
    col_map_dj = {strip_accents(v): k for k, v in header_dj.items()}

    modos_data = []
    for r in dj_rows[1:]:
        nombre = r.get(col_map_dj.get('juegos', 'A'), '').strip()
        if not nombre:
            continue
        modos_data.append({
            "modo": nombre,
            "descripcion": r.get(col_map_dj.get('descripcion', 'B'), '').strip(),
            "multiplicador": r.get(col_map_dj.get('multiplicador', 'C'), '').strip()
        })

    # 7. DANDO JUGO MINIJUEGOS (CATÁLOGO DE COMPETENCIA / MINIJUEGOS)
    mjg_rows = get_sheet_rows_dict('Dando Jugo MiniJuegos')
    header_mjg = mjg_rows[0]
    col_map_mjg = {strip_accents(v): k for k, v in header_mjg.items()}

    dj_minijuegos_data = []
    for r in mjg_rows[1:]:
        juego = r.get(col_map_mjg.get('juegos', 'A'), '').strip()
        if not juego:
            continue
        dj_minijuegos_data.append({
            "juego": juego,
            "descripcion": r.get(col_map_mjg.get('descripcion', 'B'), '').strip(),
            "min_jugadores": to_num_or_str(r.get(col_map_mjg.get('min. jugadores', 'C'), '')),
            "max_jugadores": to_num_or_str(r.get(col_map_mjg.get('max. jugadores', 'D'), '')),
            "voto_kamilo": r.get(col_map_mjg.get('voto kamilo', 'E'), '').strip() or None,
            "voto_diego": r.get(col_map_mjg.get('voto diego', 'F'), '').strip() or None,
            "observaciones": r.get(col_map_mjg.get('observaciones', 'G'), '').strip() or None
        })

    # Guardar en data/ y src/data/
    files_to_save = {
        'trivia.json': trivia_data,
        'minijuegos.json': minijuegos_data,
        'jugo.json': jugo_data,
        'hoja7_retos.json': hoja7_data,
        'variables.json': variables_dict,
        'modos_juego.json': modos_data,
        'catalogo_minijuegos.json': dj_minijuegos_data
    }

    for dir_path in target_dirs:
        for filename, data in files_to_save.items():
            full_path = os.path.join(dir_path, filename)
            with open(full_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

    print("=== RESUMEN DE ACTUALIZACIÓN ===")
    print(f"Trivia: {len(trivia_data)} tarjetas")
    print(f"Minijuegos: {len(minijuegos_data)} tarjetas")
    print(f"Jugo: {len(jugo_data)} tarjetas")
    print(f"Hoja 7 (Retos): {len(hoja7_data)} tarjetas")
    print(f"Variables: {len(variables_dict)} variables ({list(variables_dict.keys())})")
    print(f"Modos de Juego: {len(modos_data)} modos")
    print(f"Catálogo Minijuegos: {len(dj_minijuegos_data)} juegos")

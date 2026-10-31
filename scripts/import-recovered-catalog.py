"""Import preserved spreadsheet records and their local media; never writes to an API."""
import json
from pathlib import Path
import shutil
import zlib

root = Path(__file__).resolve().parents[1]
source = root.parent / 'audio-guide/recovery/catalog-source-records.json'
records = json.loads(source.read_text())
credits = {r['id'].strip(): r.get('credits', '').strip() for r in records['images']}
points = []
seen = set()
media = root / 'public/catalog'
(media / 'images').mkdir(parents=True, exist_ok=True)
(media / 'audio').mkdir(parents=True, exist_ok=True)

def hours(value):
    result = []
    for interval in value.replace('–', '-').split(','):
        if not interval.strip():
            continue
        times = []
        for time in interval.strip().split('-'):
            hour, minute = map(int, time.strip().split(':'))
            assert 0 <= hour <= 23 and 0 <= minute <= 59, value
            times.append(f'{hour:02}:{minute:02}')
        assert len(times) == 2, value
        result.append('-'.join(times))
    return ','.join(result)

for row in records['points']:
    audio_id = row['audio'].strip()
    # Negative, stable, local-only identifiers. Never use these as PostgreSQL IDs.
    point_id = -(zlib.crc32(audio_id.encode()) + 1)
    assert point_id not in seen
    seen.add(point_id)
    images = []
    for image_id in row['images'].split(','):
        image_id = image_id.strip()
        image_source = root.parent / 'image-store' / f'{image_id}.jpg'
        assert image_source.is_file(), image_source
        shutil.copyfile(image_source, media / 'images' / image_source.name)
        images.append({'url': f'/catalog/images/{image_source.name}', 'credits': credits.get(image_id, '')})
    audio_source = root.parent / 'audio-store' / f'{audio_id}.mp3'
    assert audio_source.is_file(), audio_source
    shutil.copyfile(audio_source, media / 'audio' / audio_source.name)
    points.append({
        'id': point_id, 'source': 'recovered', 'locationNeedsReview': not (-8 < float(row['latitude']) < -7 and -36 < float(row['longitude']) < -35), 'name': row['name'].strip(), 'type': row['type'].strip(),
        'latitude': float(row['latitude']), 'longitude': float(row['longitude']),
        'address': row.get('address', '').strip(), 'entryPrice': float(row['entry_price']) if row.get('entry_price') else None,
        'accessible': {'1': True, '0': False}.get(row.get('accessible')), 'rating': 0,
        'tags': [t.strip() for t in row.get('tags', '').split(',') if t.strip()],
        'images': images, 'audio': f'/catalog/audio/{audio_id}.mp3', 'transcript': row['transcript'].strip(),
        'language': row.get('language', 'pt'), 'email': row.get('email', '').strip(), 'telephone': row.get('telephone', '').strip(),
        'shouldContact': row.get('should_contact') == '1', 'hours': [hours(row.get(f'day_{i}', '')) for i in range(1, 8)],
    })
output = {'provenance': {'url': records['source'], 'retrieved': records['retrieved'], 'contentYear': 2024, 'ids': 'Negative CRC32 of original audio UUID + 1; local only, not database IDs.'}, 'points': points}
(root / 'src/data/recovered-catalog.json').write_text(json.dumps(output, ensure_ascii=False, indent=2) + '\n')
print(f'Imported {len(points)} points; all referenced media copied locally.')

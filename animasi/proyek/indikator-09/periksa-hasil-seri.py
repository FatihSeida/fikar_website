from pathlib import Path
import hashlib
import json
import subprocess
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[2]
hasil = root / 'hasil'
report = []
sheet = Image.new('RGB', (1620, 1000), '#082118')
draw = ImageDraw.Draw(sheet)
for i, nomor in enumerate(range(9, 15)):
    name = f'indikator-{nomor:02}'
    video = hasil / f'{name}-suara.mp4'
    probe = json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-show_entries',
        'stream=codec_name,width,height,r_frame_rate,nb_frames,sample_rate,channels:format=duration',
        '-of', 'json', str(video)]))
    v, a = probe['streams']
    assert (v['codec_name'], v['width'], v['height'], v['r_frame_rate'], v['nb_frames']) == ('h264', 1080, 1920, '30/1', '630'), name
    assert (a['codec_name'], a['sample_rate'], a['channels']) == ('aac', '48000', 2), name
    assert abs(float(probe['format']['duration']) - 21) < 0.001, name
    qa = json.loads((hasil / f'{name}-determinisme.json').read_text())
    assert qa['frozen'] and not qa['errors'] and all(s['stable'] for s in qa['seek']), name
    assert 'ISI KUIS' in qa['visibleText'] and 'ahmadzulfikar.com/kuis' in qa['visibleText'], name
    frame = hasil / f'{name}-frame-video-akhir.png'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', '19.5', '-i', str(video), '-frames:v', '1', str(frame)], check=True)
    thumb = Image.open(frame).convert('RGB').resize((270, 480))
    x = i * 270
    draw.text((x + 12, 8), name, fill='#c9a85c')
    sheet.paste(thumb, (x, 30))
    middle = hasil / f'{name}-frame-video-langkah.png'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-ss', '16.6', '-i', str(video), '-frames:v', '1', str(middle)], check=True)
    sheet.paste(Image.open(middle).convert('RGB').resize((270, 480)), (x, 520))
    report.append({'name': name, 'file': str(video), 'bytes': video.stat().st_size,
                   'sha256': hashlib.sha256(video.read_bytes()).hexdigest(),
                   'metadata': probe, 'qa': 'PASS', 'cta': 'ISI KUIS — ahmadzulfikar.com/kuis'})
sheet.save(hasil / 'indikator-09-14-tinjauan-video.png')
(hasil / 'indikator-09-14-verifikasi-final.json').write_text(json.dumps(report, indent=2) + '\n')
print(json.dumps([{'name': r['name'], 'qa': r['qa'], 'bytes': r['bytes']} for r in report], indent=2))

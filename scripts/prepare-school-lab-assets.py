#!/usr/bin/env python3
"""Copy the five selected original films and derive posters without editing them."""
import argparse
import hashlib
import json
import shutil
import subprocess
from pathlib import Path

from PIL import Image, ImageOps


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--source-root', type=Path, required=True, help='short-drama-studio checkout')
    parser.add_argument('--frames-dir', type=Path, required=True, help='temporary directory outside public')
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    source = args.source_root / 'productions/school-secret-lab'
    images = root / 'public/images/projects/school-secret-lab'
    videos = root / 'public/videos/projects/school-secret-lab'
    for directory in (images, videos, args.frames_dir):
        directory.mkdir(parents=True, exist_ok=True)
    selections = [
        ('ep01-night-glow', 'episodes/ep01-night-glow', 4.0, 'fdad42088b8b98ddb021c2020e6aa345bd92b63cae2de2e444c62521a7945cfb'),
        ('ep02-fire-phoenix', 'episodes/ep02-fire-phoenix', 18.5, '8cd273085a1c65e3f7209e79b24f47ce215bf8dc4a45af3557341048b8062e51'),
        ('ep03-crystal-materials', 'episodes/ep03-crystal-materials', 12.0, '634fb76ad57d8136ffeea4111a17dc8fb465c4a932081d77cea56f1a77778b4a'),
        ('stones-pickup', 'shots/ep03-s01-cold-stones', 2.8, 'dda81cebc65c64daa3c9c1780c632773314b29404650a1d28867abea656ad064'),
        ('classroom-storage', 'shots/classroom-store-five-stones', 4.8, '771d732e3bacf79585ce3d87dbb2ab0470404f66f296b6f1d511f2205ca3e76d'),
    ]
    records = []
    for name, relative, timestamp, expected in selections:
        original = source / relative / 'deliverables/final.mp4'
        if digest(original) != expected:
            raise ValueError(f'Selected source changed: {relative}')
        target = videos / f'{name}.mp4'
        shutil.copyfile(original, target)
        frame = args.frames_dir / f'{name}.png'
        subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', str(timestamp), '-i', str(target), '-frames:v', '1', str(frame)], check=True)
        with Image.open(frame) as image:
            ImageOps.contain(image.convert('RGB'), (720, 1280)).save(images / f'{name}.webp', quality=88)
        probe = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', str(target)]))
        records.append({'name': name, 'source': f'{relative}/deliverables/final.mp4', 'publicPath': f'/videos/projects/school-secret-lab/{name}.mp4',
                        'sha256': digest(target), 'bytes': target.stat().st_size, 'duration': float(probe['format']['duration']), 'posterAt': timestamp})
    cover = Image.new('RGB', (1200, 750), '#182019')
    for index, (name, *_rest) in enumerate(selections[:3]):
        with Image.open(args.frames_dir / f'{name}.png') as original:
            tile = ImageOps.contain(original.convert('RGB'), (350, 650))
            cover.paste(tile, (50 + index * 375, (750 - tile.height) // 2))
    cover.save(root / 'public/images/projects/school-secret-lab.webp', quality=88)
    manifest = {'date': '2026-10-01', 'method': 'Unchanged MP4 copy; posters from final films; three full portrait frames on a 1200x750 cover.', 'films': records}
    (root / 'docs/school-secret-lab-media.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps(manifest, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()

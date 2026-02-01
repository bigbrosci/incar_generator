# -*- mode: python ; coding: utf-8 -*-
import sys

# Disable problematic hooks
sys.modules['PyQt5'] = None
sys.modules['PySide6'] = None

a = Analysis(
    ['app.py'],
    pathex=[],
    binaries=[],
    datas=[
        ('templates', 'templates'),
        ('static', 'static'),
        ('task_config.json', '.'),
    ],
    hiddenimports=['flask', 'werkzeug', 'jinja2', 'incar_core'],
    hookspath=['./hooks'],
    hooksconfig={},
    runtime_hooks=[],
    excludedimports=['PyQt5', 'PySide6', 'tkinter'],
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='INCAR_Generator',
    debug=False,
    bootloader_ignore_signals=False,
    strip=True,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=True,
)

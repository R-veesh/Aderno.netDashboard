import os
import ftplib
import time

FTP_HOST = "ftp.aderno.net"
FTP_USER = "Raweesha@app.aderno.net"
FTP_PASS = "nkS1H5UwhsHv&SoK"
LOCAL_DIR = "frontend/dist"

def ensure_remote_dirs(ftp, remote_dir):
    parts = remote_dir.strip('/').split('/')
    cur = ""
    for p in parts:
        if not p:
            continue
        cur += "/" + p
        try:
            ftp.mkd(cur)
            print(f"Created remote dir: {cur}")
        except Exception:
            pass

def upload_all():
    print(f"Connecting to {FTP_HOST} for Dashboard (app.aderno.net)...")
    ftp = ftplib.FTP()
    ftp.connect(FTP_HOST, 21, timeout=30)
    ftp.login(FTP_USER, FTP_PASS)
    ftp.set_pasv(True)
    print(f"Connected and authenticated. Remote PWD: {ftp.pwd()}")

    all_files = []
    for root, dirs, files in os.walk(LOCAL_DIR):
        for f in files:
            local_path = os.path.join(root, f)
            rel_path = os.path.relpath(local_path, LOCAL_DIR).replace('\\', '/')
            all_files.append((local_path, rel_path))

    # Ensure directories exist
    dirs_to_make = set()
    for _, rel_path in all_files:
        d = os.path.dirname(rel_path)
        if d:
            dirs_to_make.add(d)

    for d in sorted(dirs_to_make):
        ensure_remote_dirs(ftp, d)

    total = len(all_files)
    print(f"Total files to deploy: {total}")

    for idx, (local_path, rel_path) in enumerate(all_files):
        success = False
        for attempt in range(1, 4):
            try:
                with open(local_path, "rb") as fp:
                    ftp.storbinary(f"STOR {rel_path}", fp)
                print(f"[{idx+1}/{total}] Uploaded: {rel_path}")
                success = True
                break
            except Exception as e:
                print(f"  Attempt {attempt} failed for {rel_path}: {e}")
                time.sleep(2)
                try:
                    ftp.connect(FTP_HOST, 21, timeout=30)
                    ftp.login(FTP_USER, FTP_PASS)
                    ftp.set_pasv(True)
                except Exception:
                    pass
        if not success:
            raise RuntimeError(f"FAILED to upload: {rel_path}")

    ftp.quit()
    print("Dashboard deployment completed successfully!")

if __name__ == "__main__":
    upload_all()

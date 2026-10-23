import os

PROJECT_DIR = "/Users/anmolchauhan/Signal Project"

DIRECTORIES = [
    ("Frontend", os.path.join(PROJECT_DIR, "frontend", "src")),
    ("Backend", os.path.join(PROJECT_DIR, "backend")),
]

for name, directory in DIRECTORIES:
    print(f"\n{'=' * 50}")
    print(f"{name} Files")
    print(f"{'=' * 50}")

    if not os.path.isdir(directory):
        print(f"Directory not found: {directory}")
        continue

    for root, dirs, files in os.walk(directory):
        dirs[:] = [
            d for d in dirs
            if d not in {"node_modules", "__pycache__", "venv", ".venv"}
        ]

        for filename in sorted(files):
            if filename.endswith((".py", ".jsx", ".js", ".tsx", ".ts", ".css", ".json")):
                filepath = os.path.relpath(
                    os.path.join(root, filename),
                    PROJECT_DIR
                )
                print(filepath)

print("\nFile listing complete.")
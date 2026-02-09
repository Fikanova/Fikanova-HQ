#!/usr/bin/env python3
import os
import json
import argparse
import urllib.request
import urllib.error
import sys

def find_workflow_files(root_dir):
    workflow_files = []
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file == 'workflow.json' or file == 'orchestrator.json' or file == 'manager.json':
                workflow_files.append(os.path.join(root, file))
            # Also catch specific named orchestrators if they don't follow the exact naming convention but are json
            elif file.endswith('.json') and ('orchestrator' in file or 'workflow' in file):
                 if os.path.join(root, file) not in workflow_files: # avoid duplicates
                    workflow_files.append(os.path.join(root, file))
    return workflow_files

def get_existing_workflows(base_url, api_key):
    url = f"{base_url.rstrip('/')}/api/v1/workflows"
    headers = {
        'X-N8N-API-KEY': api_key,
        'Content-Type': 'application/json'
    }
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                return {w['name'] for w in data.get('data', [])}
    except Exception as e:
        print(f"⚠️  Could not fetch existing workflows: {e}")
    return set()


def import_workflow(file_path, base_url, api_key, dry_run=False):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            workflow_data = json.load(f)
    except Exception as e:
        print(f"❌ Error reading {file_path}: {e}")
        return False

    # Basic validation: check if it looks like an n8n workflow
    if 'nodes' not in workflow_data:
        print(f"⚠️  Skipping {file_path}: Does not look like a valid n8n workflow (missing nodes).")
        return False

    workflow_name = workflow_data.get('name', os.path.basename(file_path))
    print(f"📦 Found workflow: {workflow_name} ({file_path})")

    if dry_run:
        return True

    url = f"{base_url.rstrip('/')}/api/v1/workflows"
    headers = {
        'X-N8N-API-KEY': api_key,
        'Content-Type': 'application/json'
    }

    # Prepare payload for API
    # 1. Remove 'id' creating a new workflow usually generates one.
    # 2. Ensure 'settings' exists.
    # 3. Keep only standard fields to avoid "additional properties" error.
    
    valid_keys = ['name', 'nodes', 'connections', 'settings', 'meta']
    payload = {}
    
    for key in valid_keys:
        if key in workflow_data:
            payload[key] = workflow_data[key]
            
    # Ensure settings exists
    if 'settings' not in payload:
        payload['settings'] = {}
        
    # If original had 'name', ensure it is used, otherwise filename
    if 'name' not in payload:
        payload['name'] = workflow_name

    try:
        req = urllib.request.Request(url, data=json.dumps(payload).encode('utf-8'), headers=headers, method='POST')
        with urllib.request.urlopen(req) as response:
            if response.status in [200, 201]:
                res_json = json.loads(response.read().decode('utf-8'))
                new_id = res_json.get('id')
                print(f"✅ Successfully imported '{workflow_name}' -> ID: {new_id}")
                return True
            else:
                print(f"❌ Failed to import '{workflow_name}'. Status: {response.status}")
                return False
    except urllib.error.HTTPError as e:
        print(f"❌ HTTP Error importing '{workflow_name}': {e.code} - {e.reason}")
        try:
            print(e.read().decode('utf-8'))
        except:
            pass
        return False
    except urllib.error.URLError as e:
        print(f"❌ Connection Error: {e.reason}")
        return False
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Bulk import n8n workflows.')
    parser.add_argument('--dir', default='agents', help='Directory to search for workflows (default: agents)')
    parser.add_argument('--host', help='n8n Host URL (e.g., https://n8n.example.com)')
    parser.add_argument('--key', help='n8n API Key')
    parser.add_argument('--dry-run', action='store_true', help='Scan files without importing')

    args = parser.parse_args()

    # If not dry run, require host and key
    if not args.dry_run and (not args.host or not args.key):
        print("Error: --host and --key are required unless using --dry-run")
        parser.print_help()
        sys.exit(1)

    # Use current working directory + provided dir
    search_dir = os.path.join(os.getcwd(), args.dir)
    if not os.path.exists(search_dir):
        print(f"Error: Directory '{search_dir}' does not exist.")
        sys.exit(1)

    print(f"🔍 Searching for workflows in: {search_dir}")
    files = find_workflow_files(search_dir)
    print(f"Found {len(files)} potential workflow files.\n")

    if not args.dry_run:
        existing_names = get_existing_workflows(args.host, args.key)
        print(f"ℹ️  Found {len(existing_names)} existing workflows on server.")
    else:
        existing_names = set()

    success_count = 0
    skipped_count = 0
    for file_path in files:
        # Check name before processing
        try:
             with open(file_path, 'r', encoding='utf-8') as f:
                wd = json.load(f)
                w_name = wd.get('name', os.path.basename(file_path))
                if w_name in existing_names:
                    print(f"⏭️  Skipping '{w_name}' (already exists)")
                    skipped_count += 1
                    continue
        except:
            pass 

        if import_workflow(file_path, args.host, args.key, args.dry_run):
            success_count += 1
            
    if args.dry_run:
        print(f"\n✨ Dry run complete. Found and validated {success_count} workflows.")
    else:
        print(f"\n✨ Import complete. Imported: {success_count}, Skipped: {skipped_count}, Total Files: {len(files)}")

if __name__ == '__main__':
    main()

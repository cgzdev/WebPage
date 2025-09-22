#!/bin/bash

echo "=== Pinakothek User Registration Monitor ==="
echo "Press Ctrl+C to stop monitoring"
echo "=========================================="
echo ""

while true; do
    clear
    echo "=== Pinakothek User Registration Monitor ==="
    echo "Last updated: $(date)"
    echo "=========================================="
    echo ""
    
    if [ -f "/root/WebPage/data/usuarios.md" ]; then
        cat /root/WebPage/data/usuarios.md
    else
        echo "No user data file found yet."
    fi
    
    echo ""
    echo "=========================================="
    echo "Monitoring... (Press Ctrl+C to stop)"
    
    sleep 3
done

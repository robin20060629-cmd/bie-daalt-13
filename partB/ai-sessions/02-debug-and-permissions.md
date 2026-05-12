# AI Session 02: Debugging NPM Permissions and Port Conflicts
**Огноо:** 2026-05-12
**Зорилго:** Frontend сангуудыг суулгах болон "Server can't connect" алдааг засах.

### Тулгарсан асуудал:
1. Safari браузер сервер рүү холбогдож чадахгүй байсан.
2. `npm install` хийх үед `EACCES` (Permission denied) алдаа гарсан.

### AI-ийн тусламжтай авсан арга хэмжээ:
- **Port Conflict:** `lsof -i :3001` ашиглан порт түгжигдсэн байгааг олж мэдээд `killall node` хийж чөлөөлсөн.
- **Permission Issue:** AI-аас `sudo chown -R 501:20 "/Users/pro/.npm"` командыг санал болгосон.

### Үр дүн:
- Эрхийг зассанаар `axios`, `lucide-react` сангууд амжилттай суусан.
- Backend болон Frontend хоорондоо холбогдож, `304 Not Modified` хариу авч чадсан.
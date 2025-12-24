
const data = {
  "user": {
    "id": "u1",
    "name": "JjDaBid",
    "nickname": "JjDaBid",
    "team": "Team Redline",
    "country": "Colombia",
    "countryCode": "co",
    "avatar": "https://picsum.photos/200/200?random=1",
    "rating": 2150,
    "class": "Diamante",
    "stats": {
      "totalRaces": 142,
      "podiums": 38,
      "wins": 12,
      "safetyRating": "A 4.99",
      "winRate": "18%",
      "incidentsPerRace": 1.2
    },
    "eloHistory": [
      { "name": "1", "elo": 2000 },
      { "name": "10", "elo": 2050 },
      { "name": "20", "elo": 1980 },
      { "name": "30", "elo": 2100 },
      { "name": "40", "elo": 2080 },
      { "name": "50", "elo": 2150 }
    ],
    "trophies": [
      { "name": "Rey de la Pole", "desc": "5 poles consecutivas", "color": "from-yellow-500 to-amber-700" },
      { "name": "Noctámbulo", "desc": "Carrera de 24h", "color": "from-slate-400 to-slate-600" },
      { "name": "Piloto Limpio", "desc": "10 carreras sin incidentes", "color": "from-blue-500 to-blue-900" }
    ]
  },
  "tracks": [
    { "id": "t1", "name": "Circuit de Spa-Francorchamps", "layout": "GP Layout", "country": "Bélgica", "countryCode": "be", "flag": "🇧🇪", "distance": "7.004 km", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuC_mUzNe0mdMr_fEb1DAWs9s3n85e-Uxu8WnfzXarYtU2Rto1VW-nOE59s7FcaQLGhn6b-8JmOEGSfoP425N-t_xJJEuzmUT15xZZIdTGaH9gVt-u2RJ3TPhMJojaVNs-dzQObVhlCFCWMyrzM47Z2VK2eQ8wbY0mGxXerGnJ7DlFe9R_I1O-xQ_MZhE5aiAF3CVK36u2SDPrX4JATH7mEvidj6t-6m5YGFql9oIDeBUQJEEfsFY8qsX272tkiuERM0xBG-BLExwA" },
    { "id": "t2", "name": "Laguna Seca", "layout": "Full Course", "country": "EE.UU.", "countryCode": "us", "flag": "🇺🇸", "distance": "3.602 km", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuB7Vf53n4H9CgVxlOazdRT9shmGybptw2YYEq4FB8ah5sBB8jB7CS2dcR781_md-EvNw_pKo8aDY-F5h-3Ri1NOT6cMKyGcHF0Wu4mEj3ve85jPUrdZTCMIlb3lQKiRfXF61vUmCnChin_QGlnQ2s2g5cjHjrrUCz4TH5_ou3mK3go-O1g6COCpYSoj5xEofvXigMimGlSiQMJ6VODAgDps5jYEvVnaT2Vk4kdjINQleGus8BYBqD3XaZSiSXJ489Xp4sr6_1bvgg" },
    { "id": "t3", "name": "Autodromo Nazionale Monza", "layout": "GP Layout", "country": "Italia", "countryCode": "it", "flag": "🇮🇹", "distance": "5.793 km", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuBXD9qDlazv4zX8zXicPx2_cBVGjHXbclFHkqArlDZcgYXLcQ04vfsDlFuHePfsATQuMIEc6lQoHr24Lf4Aa2hE_DT3ZUayA9q7U0n-dBiQAc1HRL7kbf9fCVyqwlAFFb4n93jnUZs7ytjh4Kx8ZSPwoeO385kBBgraXCSg2tXQ3M-uhZNIcu0_jS-u76xfBBIULMv6ZMS3iVdnrLGv5wtmWrHz62HR3DMTPpBTC9_r45PSEoi_TGjbq8hT3yUffQBrtoprnuHaVw" },
    { "id": "t4", "name": "Silverstone Circuit", "layout": "Grand Prix", "country": "Reino Unido", "countryCode": "gb", "flag": "🇬🇧", "distance": "5.891 km", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuB-JcdLEKh1-EBxomNQCX3ed9Qv1Nj8q3NPjGuU4DeezJKbkykd-EdmSEzSsbtqFdNE1GbDTTfBvzJTDdyEtourhj088hu5Pdfhj9CsDa3q7qO5lewjP0dAkRQ2eEfOMtMxhzJ5OwKWVTSFEmlHgimMNe6dWnV-AA8ZBp5J86AnN9K6yXtCfWXe19caO_UmJO6Lk9_w0cwkZ0GF7RdF2mLNBzKib8uVKB7V6uCsJOQZEMT1FLbQknwJCGOMvK1MjZ3WtQyf3pfM6A" },
    { "id": "t5", "name": "Suzuka International", "layout": "GP Course", "country": "Japón", "countryCode": "jp", "flag": "🇯🇵", "distance": "5.807 km", "image": "https://lh3.googleusercontent.com/aida-public/AB6AXuAoQvIHHXMUkFQKFV03HemmTfqObFLbtPWWCeO-1OwW08P0hSLOeVuXBnMFkiz1GtVqNTChfoZMpJXA_ZKBiiXQjXmIhGPolWycBHXHD6MzwyPrgQHKuDWaaKPKHn0_l7EEu5VZHZYArhZYoqCOeDQeLTU4-CFAeNJ2V3-0xCA5-GTZnvohZCWIZiwlLxBrwCr2Vxzyl-7K0denp4qpEw8Wcwy_RqGPfw8rXRkxOSTU_R-_ifZYJ99bPMs7g2wdZokFDZ9b8ZZ8zA" },
    { "id": "t6", "name": "Tocancipa", "layout": "GP Course", "country": "Colombia", "countryCode": "co", "flag": "🇨🇴", "distance": "3.000 km", "image": "https://picsum.photos/400/250?random=60" }
  ],
  "cars": [
    { "id": "c1", "name": "Porsche 911 GT3 R", "category": "GT3", "country": "Alemania", "countryCode": "de", "flag": "🇩🇪", "status": "Activo", "image": "https://picsum.photos/400/240?random=20" },
    { "id": "c2", "name": "Ferrari 488 GT3", "category": "GT3", "country": "Italia", "countryCode": "it", "flag": "🇮🇹", "status": "Activo", "image": "https://picsum.photos/400/240?random=21" },
    { "id": "c3", "name": "McLaren 720S", "category": "GT3", "country": "Reino Unido", "countryCode": "gb", "flag": "🇬🇧", "status": "Mantenimiento", "image": "https://picsum.photos/400/240?random=22" },
    { "id": "c4", "name": "Audi R8 LMS", "category": "GT3", "country": "Alemania", "countryCode": "de", "flag": "🇩🇪", "status": "Activo", "image": "https://picsum.photos/400/240?random=23" }
  ],
  "events": [
    {
      "id": "e1",
      "type": "tournament",
      "status": "EN VIVO",
      "statusTag": "live",
      "category": "GT3 Series",
      "title": "Gran Premio de Monza XXX",
      "date": "Hoy, 20:00",
      "track": "Monza, IT",
      "info": "24 / 32 Pilotos",
      "meta": "90 Min",
      "image": "https://picsum.photos/600/400?random=30",
      "action": "Entrar a Sala",
      "leaderboard": [
        { "pos": 1, "name": "David Pinzon (V)", "team": "Scuderia Ferrari Esports", "wins": 2, "podiums": 3, "points": 86, "color": "text-amber-400 bg-amber-500/20" },
        { "pos": 2, "name": "Max Verstappen (V)", "team": "Redline Team", "wins": 1, "podiums": 3, "points": 78, "color": "text-slate-300 bg-slate-700" },
        { "pos": 3, "name": "L. Hamilton (V)", "team": "Mercedes AMG Petronas", "wins": 1, "podiums": 2, "points": 65, "color": "text-amber-700 bg-amber-700/20" }
      ]
    },
    {
      "id": "e2",
      "type": "league",
      "status": "PRÓXIMO",
      "statusTag": "upcoming",
      "category": "FPV League",
      "title": "Neon Night Race #4",
      "date": "18 Nov, 16:00",
      "track": "Cyber City",
      "info": "8 / 12 Pilotos",
      "meta": "Clase 5\"",
      "image": "https://picsum.photos/600/400?random=31",
      "action": "Ver Detalles"
    },
    {
      "id": "e3",
      "type": "invitation",
      "status": "INVITACIÓN",
      "statusTag": "pending",
      "category": "Privado",
      "title": "Entrenamiento Equipo Red",
      "date": "Mañana, 21:00",
      "track": "Nürburgring",
      "info": "Invitado por Carlos",
      "meta": "Elo: 2150",
      "image": "https://picsum.photos/600/400?random=32",
      "action": "Aceptar Invitación",
      "isInvite": true
    }
  ],
  "news": [
    { "id": "n1", "tag": "Reglamento", "tagColor": "text-primary", "time": "Hace 2 horas", "title": "Actualización de normativa de banderas azules", "desc": "Se han ajustado las penalizaciones por ignorar banderas azules en la categoría GT3 para mejorar la equidad.", "image": "https://picsum.photos/600/400?random=10" },
    { "id": "n2", "tag": "Liga Pro", "tagColor": "text-[#0bda5e]", "time": "Ayer", "title": "Apertura de inscripciones Temporada 5", "desc": "Ya puedes reservar tu plaza para la próxima temporada. Nuevas categorías añadidas: LMP2 y Formula Vee.", "image": "https://picsum.photos/600/400?random=11" },
    { "id": "n3", "tag": "Resultados", "tagColor": "text-yellow-500", "time": "3 días atrás", "title": "Resumen: GP de Spa Francorchamps", "desc": "Una carrera llena de incidentes bajo la lluvia. Consulta los resultados finales y las sanciones aplicadas.", "image": "https://picsum.photos/600/400?random=12" }
  ],
  "notifications": [
    { "id": "not1", "icon": "emoji_events", "color": "text-primary bg-primary/20", "title": "Invitación: Torneo GT3 Winter Cup", "desc": "La escudería Redline Racing te ha invitado a participar en la clasificatoria de invierno.", "time": "10:45 AM", "actions": true, "isRead": false },
    { "id": "not2", "icon": "timer", "color": "text-orange-500 bg-orange-500/10", "title": "Recordatorio de Carrera: Suzuka", "desc": "La sala de espera para la Ronda 4 abre en 30 minutes.", "time": "Hace 2 horas", "isRead": false },
    { "id": "not3", "icon": "info", "color": "text-blue-400 bg-blue-500/10", "title": "Actualización del Sistema v2.4", "desc": "Se han corregido errores en el sistema de telemetría.", "time": "Ayer", "isRead": true }
  ],
  "metadata": {
    "simulators": [
      { "name": "Assetto Corsa", "url": "https://picsum.photos/400/250?random=101" },
      { "name": "iRacing", "url": "https://picsum.photos/400/250?random=102" },
      { "name": "ACC", "url": "https://picsum.photos/400/250?random=103" },
      { "name": "rFactor 2", "url": "https://picsum.photos/400/250?random=104" },
      { "name": "F1 24", "url": "https://picsum.photos/400/250?random=105" }
    ],
    "countries": [
      { "name": "España", "code": "es", "flag": "🇪🇸" },
      { "name": "Italia", "code": "it", "flag": "🇮🇹" },
      { "name": "Alemania", "code": "de", "flag": "🇩🇪" },
      { "name": "EE.UU.", "code": "us", "flag": "🇺🇸" },
      { "name": "Reino Unido", "code": "gb", "flag": "🇬🇧" },
      { "name": "Japón", "code": "jp", "flag": "🇯🇵" },
      { "name": "Colombia", "code": "co", "flag": "🇨🇴" }
    ],
    "categories": ["GT3", "GT4", "LMP2", "Formula 1", "Freestyle"]
  }
};

export default data;

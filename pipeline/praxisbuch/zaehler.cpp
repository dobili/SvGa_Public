// Zählt Zugfolgen der ersten Halbzüge aus einem Lichess-PGN-Strom (stdin) je Zeitklasse und
// 200er-Band der ziehenden Seite. Lokal (buch/arbeit/praxisbuch), Teil des Praxisbuchs 0.2.128.
// Ausgabe (stdout): Zeilen "zelle\tvorher\tnachher\tzug\tanzahl" für Einträge ab MINDEST_AUS,
// dazu "#partien\tzelle\tanzahl". Speicher begrenzt: Über GRENZE Einträgen fallen alle mit Anzahl 1.
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <string>
#include <unordered_map>
#include <vector>

static const int HALBZUEGE = 20;
static const int BAND = 200;
static const int UNTEN = 400;
static const int OBEN = 2800;  // ab hier ein Band
static const int BAENDER = (OBEN - UNTEN) / BAND + 1;
static const size_t GRENZE = 70000000;
static const uint32_t MINDEST_AUS = 5;

struct Eintrag {
  uint32_t anzahl;
  uint16_t zelle;
  uint64_t vorher;  // Hash der Zugfolge vor dem Zug (zellenunabhängig, 0 = Grundstellung)
  uint64_t nachher;
  char zug[8];
};

static inline uint64_t misch(uint64_t x) {
  x += 0x9e3779b97f4a7c15ULL;
  x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
  x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
  return x ^ (x >> 31);
}
static inline uint64_t zughash(const char* z, int n) {
  uint64_t h = 1469598103934665603ULL;
  for (int i = 0; i < n; i++) h = (h ^ (unsigned char)z[i]) * 1099511628211ULL;
  return h;
}

int main() {
  std::unordered_map<uint64_t, Eintrag> tafel;
  tafel.reserve(GRENZE + GRENZE / 4);
  std::vector<uint64_t> partien(3 * BAENDER, 0);
  static char zeile[1 << 20];
  int klasse = -1, weiss = 0, schwarz = 0;
  uint64_t gelesen = 0, bereinigt = 0;
  while (fgets(zeile, sizeof zeile, stdin)) {
    if (zeile[0] == '[') {
      if (!strncmp(zeile, "[Event ", 7)) {
        klasse = -1;
        if (strstr(zeile, "Rated")) {
          if (strstr(zeile, "Blitz")) klasse = 0;
          else if (strstr(zeile, "Rapid")) klasse = 1;
          else if (strstr(zeile, "Classical")) klasse = 2;
        }
        weiss = schwarz = 0;
      } else if (!strncmp(zeile, "[WhiteElo ", 10)) weiss = atoi(zeile + 11);
      else if (!strncmp(zeile, "[BlackElo ", 10)) schwarz = atoi(zeile + 11);
      continue;
    }
    if (zeile[0] != '1' || klasse < 0 || !weiss || !schwarz) continue;
    gelesen++;
    int band[2];
    int e[2] = {weiss, schwarz};
    for (int s = 0; s < 2; s++) {
      int b = (e[s] < UNTEN ? UNTEN : e[s] > OBEN ? OBEN : e[s]);
      band[s] = (b - UNTEN) / BAND;
      partien[klasse * BAENDER + band[s]]++;  // je Seite eine Zählung
    }
    int zelle[2] = {klasse * BAENDER + band[0], klasse * BAENDER + band[1]};
    uint64_t h[2] = {misch(zelle[0] + 7), misch(zelle[1] + 7)};
    uint64_t verlauf = 0;  // Hash der Zugfolge (für beide Seiten gleich)
    int ply = 0;
    char* p = zeile;
    while (*p && ply < HALBZUEGE) {
      while (*p == ' ') p++;
      if (*p == '{') { while (*p && *p != '}') p++; if (*p) p++; continue; }
      char* a = p;
      while (*p && *p != ' ' && *p != '\n') p++;
      int n = p - a;
      if (n == 0) { if (*p) p++; continue; }
      if (a[n - 1] == '.' || (a[0] >= '0' && a[0] <= '9')) continue;  // Zugnummer oder Ergebnis
      while (n > 0 && (a[n - 1] == '!' || a[n - 1] == '?')) n--;
      if (n <= 0 || n > 7) break;
      uint64_t vorher = verlauf;
      verlauf = misch(verlauf ^ zughash(a, n) ^ (uint64_t)ply) | 1;  // nie 0
      int s = ply % 2;
      // Schlüssel: Zelle der ziehenden Seite und Zugfolge bis einschließlich dieses Zuges
      auto& z = tafel[misch(verlauf ^ h[s])];
      if (z.anzahl == 0) {
        z.zelle = zelle[s]; z.vorher = vorher; z.nachher = verlauf;
        memcpy(z.zug, a, n); z.zug[n] = 0;
      }
      z.anzahl++;
      ply++;
      if (*p) p++;
    }
    if (tafel.size() > GRENZE) {
      for (auto it = tafel.begin(); it != tafel.end();) it = (it->second.anzahl <= 1) ? tafel.erase(it) : std::next(it);
      bereinigt++;
      fprintf(stderr, "bereinigt %llu nach %llu Partien, bleiben %zu\n", (unsigned long long)bereinigt, (unsigned long long)gelesen, tafel.size());
    }
    if (gelesen % 5000000 == 0) fprintf(stderr, "%llu Partien, %zu Einträge\n", (unsigned long long)gelesen, tafel.size());
  }
  for (int i = 0; i < 3 * BAENDER; i++) printf("#partien\t%d\t%llu\n", i, (unsigned long long)partien[i]);
  for (auto& kv : tafel)
    if (kv.second.anzahl >= MINDEST_AUS)
      printf("%u\t%llu\t%llu\t%s\t%u\n", kv.second.zelle, (unsigned long long)kv.second.vorher, (unsigned long long)kv.second.nachher, kv.second.zug, kv.second.anzahl);
  fprintf(stderr, "fertig: %llu Partien\n", (unsigned long long)gelesen);
  return 0;
}

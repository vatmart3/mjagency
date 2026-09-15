#!/usr/bin/env python3
# =========================================================
# MJ AGENCY — bruitage des séquences animées
#
# Tout est synthétisé. Deux principes, tirés de ce qui ne
# marchait pas dans une première version :
#
#   1. Aucune hauteur musicale. Pas de carillon, pas de
#      mélodie : des objets frappés. Un grain de bruit excite
#      quatre résonances INHARMONIQUES qui s'éteignent en
#      quelques dizaines de millisecondes — c'est un tap, un
#      toc, pas un bip.
#   2. Aucun sifflement. Les déplacements sont courts et
#      coupés sous 900 Hz : de l'air sourd, pas du souffle
#      de bande.
#
#   python3 bruitage.py film1 sortie.wav
#   python3 bruitage.py film2 sortie.wav
# =========================================================
import sys, numpy as np

SR = 48000
RNG = np.random.default_rng(20260915)

# ---------------------------------------------------------
# Briques
# ---------------------------------------------------------
def bruit(n):
    return RNG.standard_normal(n)

def passe_bas(x, f0, f1=None):
    f1 = f0 if f1 is None else f1
    f = np.linspace(f0, f1, len(x))
    a = np.exp(-2 * np.pi * f / SR)
    y = np.empty_like(x); z = 0.0
    for i in range(len(x)):
        z = (1 - a[i]) * x[i] + a[i] * z
        y[i] = z
    return y

def passe_haut(x, f):
    return x - passe_bas(x, f)

def sourd(x, f, ordre=4):
    """Passe-bas raide. Un seul pôle ne coupe qu'à 6 dB par octave :
    à 520 Hz de coupure il laissait encore la moitié de l'énergie
    au-dessus de 2,5 kHz, c'est-à-dire tout le sifflement."""
    for _ in range(ordre):
        x = passe_bas(x, f)
    return x

# Rapports inharmoniques : ceux d'une barre ou d'une plaque frappée,
# pas ceux d'une note. C'est ce qui fait entendre un objet.
RAPPORTS = (1.0, 1.41, 2.13, 2.91, 4.07)

def frappe(base, chutes, duree, gains=(1, .62, .38, .22, .12), grain=.55, bande=(1.0,)):
    """Un objet frappé : grain de bruit, puis résonances qui s'éteignent."""
    n = int(duree * SR); t = np.arange(n) / SR
    y = np.zeros(n)
    for r, g, d in zip(RAPPORTS, gains, chutes):
        y += g * np.sin(2 * np.pi * base * r * t + RNG.uniform(0, 6.28)) * np.exp(-t / d)
    a = max(4, int(.0035 * SR))
    y[:a] += passe_haut(bruit(a), 900) * np.linspace(1, 0, a) ** 2 * grain * np.abs(y).max()
    return y / max(1e-9, np.abs(y).max())

# --- la famille des gestes -------------------------------
def tap(i=0):
    """Petit repère : une ligne qui se pose, une donnée qui s'allume."""
    return frappe(1380 + i * 80, (.018, .013, .010, .007, .005), .09, grain=.5)

def touche(i=0):
    """Touche de pavé : plus de corps, toujours très court."""
    return frappe(940 + i * 55, (.034, .025, .017, .012, .008), .16, grain=.6)

def bouton():
    """Bouton d'action : plus grave, un peu plus long."""
    return frappe(520, (.055, .040, .026, .018, .012), .24, grain=.5)

def toc():
    """Une donnée qui se pose : le son d'arrivée."""
    return frappe(340, (.115, .085, .055, .035, .022), .45, grain=.42)

def acquis():
    """Ce qui est acquis — deux frappes très rapprochées, sans mélodie."""
    a, b = frappe(300, (.12, .09, .06, .04, .025), .45, grain=.4), \
           frappe(232, (.20, .15, .10, .06, .04), .7, grain=.3)
    y = np.zeros(int(.75 * SR))
    y[:len(a)] += a * .62
    d = int(.075 * SR); y[d:d + len(b)] += b[:len(y) - d] * .95
    return y / max(1e-9, np.abs(y).max())

def mouvement(duree=.16, grave=True):
    """Un panneau qui se déplace : de l'air sourd, rien au-dessus de 900 Hz."""
    n = int(duree * SR); t = np.linspace(0, 1, n)
    b = sourd(bruit(n), 300 if grave else 460, 5)
    b = passe_haut(b, 70)
    e = np.sin(np.pi * t) ** 1.6                    # enfle et retombe dans le geste
    return b * e / max(1e-9, np.abs(b * e).max())

def impact(duree=1.1):
    """La signature : une masse basse, sans queue métallique."""
    n = int(duree * SR); t = np.arange(n) / SR
    c = np.sin(2 * np.pi * 52 * t) * np.exp(-t / .16) \
      + np.sin(2 * np.pi * 77 * t) * np.exp(-t / .09) * .5
    s = sourd(bruit(n), 150, 4) * np.exp(-t / .13) * .8
    y = c + s
    return y / max(1e-9, np.abs(y).max())

def gonflement(duree=1.4):
    """Ce qui précède la signature : une montée sourde, coupée dans l'aigu."""
    n = int(duree * SR); t = np.linspace(0, 1, n)
    b = sourd(bruit(n), 200, 5)
    return b * (t ** 2.6) / max(1e-9, np.abs(b).max())

def egrene(duree=.9, nb=9, base=1250):
    """Un compteur qui monte : quelques petits taps, de plus en plus serrés."""
    n = int(duree * SR); y = np.zeros(n)
    for k in range(nb):
        i = int((k / nb) ** .82 * n * .9)
        g = frappe(base * (1 + .3 * k / nb), (.010, .008, .006, .005, .004), .06, grain=.75)
        y[i:i + len(g)] += g[:n - i] * (.5 + .5 * k / nb)
    return y / max(1e-9, np.abs(y).max())

# ---------------------------------------------------------
# Montage
# ---------------------------------------------------------
class Piste:
    def __init__(self, duree):
        self.n = int(duree * SR)
        self.g = np.zeros(self.n); self.d = np.zeros(self.n)
    def pose(self, t, son, gain=1.0, pan=0.0):
        i = int(t * SR)
        if i >= self.n: return
        s = son[:self.n - i] * gain
        self.g[i:i + len(s)] += s * np.sqrt((1 - pan) / 2 + .5)
        self.d[i:i + len(s)] += s * np.sqrt((1 + pan) / 2 + .5)

def reverb(x, duree=.45, melange=.11):
    """Une pièce petite et mate : juste de quoi ne pas sonner en boîte."""
    m = int(duree * SR)
    ir = RNG.standard_normal(m) * np.exp(-np.linspace(0, 9, m))
    ir = sourd(ir, 1400, 2)
    ir[:int(.008 * SR)] = 0
    ir /= np.abs(ir).max() * 14
    N = 1 << (len(x) + m - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N))[:len(x)]
    return x * (1 - melange) + y * melange

def rendre(piste, chemin, niveau=.53):
    g, d = reverb(piste.g), reverb(piste.d)
    st = np.stack([g, d], axis=1)
    st = np.tanh(st * 1.2) / np.tanh(1.2)
    st /= max(1e-9, np.abs(st).max()) / niveau        # crête à peu près -5,5 dB
    import wave
    with wave.open(chemin, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes())
    print(chemin, '—', round(len(g) / SR, 1), 's')

def notif():
    """Une notification : une frappe seule, un peu plus claire qu'un toc."""
    return frappe(430, (.090, .065, .042, .028, .018), .35, grain=.5)


# =========================================================
# Les partitions — mêmes secondes que les films
# =========================================================
def film1(p):
    """« Du mail au planning » — voir ../mjagency.js"""
    # 1 · la boîte de réception
    p.pose(0.10, mouvement(.22), .30, -.15)
    for i in range(4): p.pose(0.55 + i * .13, tap(i), .26, -.2 + i * .06)
    # 2 · le mail s'ouvre
    p.pose(2.60, mouvement(.20), .28)
    for i in range(6): p.pose(2.95 + i * .15, tap(i), .14)
    # 3 · l'IA lit
    p.pose(4.45, tap(2), .22)
    for i in range(6): p.pose(4.85 + i * .2, tap(i + 1), .24, -.35 + i * .14)
    # 4 · les données s'envolent
    p.pose(6.30, mouvement(.26, False), .38, .35)
    for i in range(6):
        t = 7.60 + i * .14
        p.pose(t, mouvement(.13), .13, -.4 + i * .16)
        p.pose(t + .85, toc(), .34, .1 + i * .05)
    # 5 · la fiche est créée
    p.pose(9.55, toc(), .30)
    p.pose(9.85, tap(1), .20); p.pose(10.00, tap(2), .16); p.pose(10.15, tap(3), .16)
    # 6 · le devis
    p.pose(11.40, mouvement(.22), .30, -.25)
    for i in range(3): p.pose(11.85 + i * .16, tap(i), .26, -.3 + i * .2)
    p.pose(12.65, tap(4), .14); p.pose(12.80, tap(5), .14)
    p.pose(12.95, egrene(1.10, 12, 1150), .30)
    p.pose(14.05, toc(), .34)
    p.pose(14.30, tap(0), .18)
    # 7 · envoi et acceptation
    p.pose(15.30, bouton(), .52)
    p.pose(15.60, mouvement(.26, False), .35, .45)
    p.pose(16.90, bouton(), .48, .4)
    p.pose(17.15, acquis(), .56, .3)
    p.pose(17.80, notif(), .34, .5)
    # 8 · le planning
    p.pose(18.60, mouvement(.22), .28, .3)
    p.pose(19.20, toc(), .40, -.15); p.pose(19.60, toc(), .28, -.3)
    # 9 · les automatisations
    for i in range(5):
        p.pose(20.75 + i * .34, toc(), .28, -.45 + i * .22)
        p.pose(21.05 + i * .34, tap(i), .12, -.45 + i * .22)
    # 10 · le tableau de bord
    p.pose(23.80, mouvement(.20), .27)
    for i in range(4):
        p.pose(24.45 + i * .16, tap(i), .22, -.3 + i * .2)
        p.pose(24.45 + i * .16, egrene(.85, 7, 1300), .14, -.3 + i * .2)
    p.pose(25.40, gonflement(.9), .24)
    # 11 · la signature
    p.pose(27.10, gonflement(1.5), .40)
    p.pose(28.00, mouvement(.30, False), .25)
    p.pose(28.72, impact(1.3), .95)


def film2(p):
    """« La carte de fidélité » — voir ../fidelite/fidelite.js"""
    # 1 · la carte
    p.pose(0.10, mouvement(.24), .30)
    p.pose(1.30, tap(1), .20)
    p.pose(1.55, egrene(.70, 6, 1050), .20)
    # 2 · la caisse, le scan
    p.pose(3.00, mouvement(.26, False), .36, .4)
    p.pose(4.40, bouton(), .52, .3)
    p.pose(4.70, mouvement(.13), .14)
    p.pose(5.55, toc(), .42, -.25)
    # 3 · la fiche, la récompense
    p.pose(6.10, toc(), .30, .2)
    p.pose(6.50, tap(0), .16, .3)
    # 4 · le montant, touche par touche
    for i in range(4): p.pose(7.40 + i * .42, touche(i), .46, .35)
    p.pose(9.40, bouton(), .32, .2)
    p.pose(9.90, tap(2), .18, .1)
    # 5 · on encaisse, les points volent
    p.pose(11.00, bouton(), .56, .15)
    p.pose(11.35, mouvement(.16), .16, .1)
    p.pose(12.20, toc(), .44, -.35)
    p.pose(12.20, egrene(.90, 10, 1100), .26, -.35)
    p.pose(11.55, notif(), .34, .45)
    # 6 · ce que ça débloque
    p.pose(13.40, toc(), .28, -.35)
    for i in range(3): p.pose(13.80 + i * .22, tap(i), .22, -.35)
    # 7 · l'anniversaire
    p.pose(16.20, mouvement(.22), .28)
    for i in range(3): p.pose(16.80 + i * .2, tap(i), .22, -.25 + i * .25)
    p.pose(18.40, bouton(), .46)
    p.pose(18.66, acquis(), .54)
    # 8 · le tableau de bord
    p.pose(20.40, mouvement(.22), .28)
    for i in range(4):
        p.pose(20.90 + i * .16, tap(i), .22, -.3 + i * .2)
        p.pose(20.90 + i * .16, egrene(.85, 8, 1250), .14, -.3 + i * .2)
    p.pose(21.50, tap(3), .16)
    p.pose(21.85, gonflement(.9), .22)
    p.pose(22.60, tap(1), .14)
    # 9 · la signature
    p.pose(25.30, gonflement(1.5), .40)
    p.pose(26.20, mouvement(.30, False), .25)
    p.pose(26.92, impact(1.3), .95)


if __name__ == '__main__':
    quel, sortie = sys.argv[1], sys.argv[2]
    p = Piste(33.0 if quel == 'film1' else 32.3)
    (film1 if quel == 'film1' else film2)(p)
    rendre(p, sortie)

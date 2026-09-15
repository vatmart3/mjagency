#!/usr/bin/env python3
# =========================================================
# MJ AGENCY — bruitage des séquences animées
#
# Tout est synthétisé : aucune banque de sons, aucun fichier
# extérieur. Chaque son est calé à la seconde sur la partition
# du film, celle-là même que lit engine.js.
#
#   python3 bruitage.py film1 sortie.wav
#   python3 bruitage.py film2 sortie.wav
# =========================================================
import sys, numpy as np

SR = 48000

# ---------------------------------------------------------
# Briques sonores
# ---------------------------------------------------------
def env(n, montee=.002, chute=.15, courbe=3.0):
    """Attaque courte, puis décroissance exponentielle.

    `chute` est la constante de temps en secondes : au bout de ce
    temps il reste exp(-courbe) de l'amplitude. (Une première version
    simplifiait chute/chute et retombait donc toujours à la même
    vitesse — tous les souffles étaient inaudibles.)"""
    a = max(1, int(montee * SR))
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a)
    t = np.arange(max(1, n - a)) / SR
    e[a:] = np.exp(-courbe * t / max(chute, 1e-4))
    return e

def bruit(n):
    return np.random.default_rng(abs(hash(n)) % 2**31).standard_normal(n)

def passe_bas(x, f0, f1=None):
    """Un pôle, fréquence de coupure éventuellement mobile."""
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

def sinus(f0, n, f1=None):
    f1 = f0 if f1 is None else f1
    f = np.linspace(f0, f1, n)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)

# --- les sons proprement dits ----------------------------
def clic(aigu=2600, duree=.045, corps=.5):
    n = int(duree * SR)
    b = passe_haut(bruit(n), 1200) * env(n, .0005, .02, 5)
    s = sinus(aigu, n, aigu * .6) * env(n, .0004, .012, 6) * corps
    return (b * .85 + s * .72)

def touche(i=0):
    """Touche de pavé : même geste, timbre légèrement différent."""
    return clic(2200 + i * 130, .05, .55) * 1.3

def blip(f=900, duree=.09, chute=.05):
    n = int(duree * SR)
    return sinus(f, n, f * .82) * env(n, .001, chute, 4) * .9

def souffle(duree=.55, mont=True, force=1.0):
    """Un panneau qui entre ou sort : bruit filtré, coupure mobile.

    Le sens compte. Ce qui entre enfle jusqu'à l'arrivée puis se
    coupe net ; ce qui sort frappe d'emblée et s'éloigne. Les deux
    partageaient au départ une enveloppe décroissante — l'entrée
    s'éteignait donc avant d'être arrivée, six décibels sous le lit
    sonore, c'est-à-dire inaudible."""
    n = int(duree * SR)
    b = bruit(n)
    b = passe_bas(b, 400, 3400) if mont else passe_bas(b, 3200, 350)
    b = passe_haut(b, 180)
    t = np.linspace(0, 1, n)
    if mont:
        e = t ** 1.7
        q = int(n * .84)
        e[q:] *= np.linspace(1, 0, n - q) ** 1.4
    else:
        e = np.exp(-2.8 * t) * (1 - np.exp(-60 * t))
    return b * e * force * .8

def carillon(base=880, partiels=(1, 2, 3.02, 4.2), duree=1.1, gains=(1, .5, .28, .14)):
    n = int(duree * SR)
    y = np.zeros(n)
    for p, g in zip(partiels, gains):
        y += sinus(base * p, n) * g * env(n, .003, duree * .55, 2.4)
    return y / max(1e-9, np.max(np.abs(y))) * .8

def reussite():
    """Deux notes qui montent : ce qui est acquis."""
    a = carillon(784, duree=.5)                      # sol
    b = carillon(1175, duree=.9)                     # ré
    y = np.zeros(int(.95 * SR))
    y[:len(a)] += a * .7
    d = int(.11 * SR)
    y[d:d + len(b)] += b[:len(y) - d] * .85
    return y * .8

def notification():
    a = carillon(1046, duree=.34); b = carillon(1568, duree=.7)
    y = np.zeros(int(.8 * SR))
    y[:len(a)] += a * .6
    d = int(.09 * SR); y[d:d + len(b)] += b[:len(y) - d] * .7
    return y * .7

def choc(f=62, duree=1.6):
    n = int(duree * SR)
    s = sinus(f * 2.4, n, f * .8) * env(n, .002, duree * .4, 2.6)
    b = passe_bas(bruit(n), 900, 120) * env(n, .001, .18, 4) * .5
    return (s + b) * .9

def montee(duree=1.8):
    """Le souffle qui précède la signature."""
    n = int(duree * SR)
    b = passe_haut(passe_bas(bruit(n), 300, 5200), 220)
    s = sinus(180, n, 720) * .25
    e = np.linspace(0, 1, n) ** 2.4
    return (b * .8 + s) * e * .5

def scintillement(duree=1.0, nb=14, f0=1800):
    """Un compteur qui monte : une poussière de petites touches."""
    n = int(duree * SR); y = np.zeros(n)
    rng = np.random.default_rng(7)
    for k in range(nb):
        t = int(k / nb * n * .92)
        f = f0 * (1 + .55 * k / nb) * rng.uniform(.94, 1.06)
        g = blip(f, .05, .028) * (.16 + .1 * k / nb)
        y[t:t + len(g)] += g[:n - t]
    return y

def nappe(duree):
    """Le lit : un bourdon très bas et un voile d'air."""
    n = int(duree * SR)
    t = np.arange(n) / SR
    y = np.zeros(n)
    for f, g in ((55, .5), (82.5, .26), (110, .16), (164.8, .07)):
        lfo = 1 + .18 * np.sin(2 * np.pi * (.045 + f / 4000) * t + f)
        y += np.sin(2 * np.pi * f * t) * g * lfo
    air = passe_bas(passe_haut(bruit(n), 500), 2600) * .06
    air *= 1 + .5 * np.sin(2 * np.pi * .07 * t)
    # Assez bas pour ne jamais masquer un clic : le lit porte, il ne parle pas.
    return (y * .024 + air * .30)

# ---------------------------------------------------------
# Montage
# ---------------------------------------------------------
class Piste:
    def __init__(self, duree):
        self.n = int(duree * SR)
        self.g = np.zeros(self.n)
        self.d = np.zeros(self.n)
    def pose(self, t, son, gain=1.0, pan=0.0):
        i = int(t * SR)
        if i >= self.n: return
        s = son[:self.n - i] * gain
        self.g[i:i + len(s)] += s * np.sqrt((1 - pan) / 2 + .5)
        self.d[i:i + len(s)] += s * np.sqrt((1 + pan) / 2 + .5)

def reverb(x, duree=.75, melange=.17):
    """Une petite salle : une queue de bruit décroissante, convoluée."""
    m = int(duree * SR)
    ir = bruit(m) * np.exp(-np.linspace(0, 7, m))
    ir = passe_bas(ir, 2600)
    ir[:int(.012 * SR)] = 0
    ir /= np.max(np.abs(ir)) * 9
    n = len(x) + m
    N = 1 << (n - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, N) * np.fft.rfft(ir, N))[:len(x)]
    return x * (1 - melange) + y * melange

def rendre(piste, chemin):
    g, d = reverb(piste.g), reverb(piste.d)
    st = np.stack([g, d], axis=1)
    st = np.tanh(st * 1.25) / np.tanh(1.25)          # limitation douce
    st /= max(1e-9, np.max(np.abs(st))) / 0.86
    import wave, struct
    with wave.open(chemin, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((st * 32767).astype('<i2').tobytes())
    print(chemin, '—', round(len(g) / SR, 1), 's')


# =========================================================
# Les partitions sonores — mêmes secondes que les films
# =========================================================
def film1(p):
    """« Du mail au planning » — voir ../mjagency.js"""
    p.pose(0, nappe(33.0), .9)

    # 1 · la boîte de réception
    p.pose(0.10, souffle(.7, True, .8), .7, -.15)
    for i in range(4):
        p.pose(0.55 + i * .13, clic(1500 + i * 90, .05, .35), .30, -.2 + i * .06)

    # 2 · le mail s'ouvre
    p.pose(2.60, souffle(.6, True, .9), .75)
    for i in range(6):
        p.pose(2.95 + i * .15, clic(1900 + i * 70, .035, .3), .16)

    # 3 · l'IA lit
    p.pose(4.45, carillon(1320, duree=.55), .22)
    for i in range(6):
        p.pose(4.85 + i * .2, blip(1500 + i * 150, .07, .035), .26, -.35 + i * .14)

    # 4 · les données s'envolent
    p.pose(6.30, souffle(.85, True, 1.0), .95, .35)
    for i in range(6):
        t = 7.60 + i * .14
        p.pose(t, souffle(.5, True, .5), .30, -.4 + i * .16)
        p.pose(t + .85, blip(1150 + i * 90, .1, .05), .42, .1 + i * .05)

    # 5 · la fiche est créée
    p.pose(9.55, carillon(1046, duree=.7), .26)
    p.pose(9.85, clic(1700, .05, .4), .22)
    p.pose(10.00, clic(1400, .04, .35), .18); p.pose(10.15, clic(1500, .04, .35), .18)

    # 6 · le devis
    p.pose(11.40, souffle(.75, True, .9), .8, -.25)
    for i in range(3):
        p.pose(11.85 + i * .16, clic(1150 + i * 110, .07, .5), .34, -.3 + i * .2)
    for i, t in enumerate((12.65, 12.80)):
        p.pose(t, clic(1900, .035, .3), .16)
    p.pose(12.95, scintillement(1.1, 16, 1500), .42)
    p.pose(14.05, blip(1760, .3, .18), .30)
    p.pose(14.30, clic(1300, .05, .4), .20)

    # 7 · envoi et acceptation
    p.pose(15.30, clic(900, .07, .8), .55)
    p.pose(15.60, souffle(.9, True, 1.0), .85, .45)
    p.pose(16.90, clic(880, .07, .8), .50, .4)
    p.pose(17.15, reussite(), .40, .3)
    p.pose(17.80, notification(), .34, .5)

    # 8 · le planning
    p.pose(18.60, souffle(.8, False, .9), .7, .3)
    p.pose(19.20, choc(96, .7), .30, -.15)
    p.pose(19.60, choc(120, .55), .22, -.3)

    # 9 · les automatisations
    for i in range(5):
        p.pose(20.75 + i * .34, blip(700 + i * 105, .14, .07), .38, -.45 + i * .22)
        p.pose(21.05 + i * .34, clic(2400, .03, .25), .13, -.45 + i * .22)

    # 10 · le tableau de bord
    p.pose(23.80, souffle(.7, True, .8), .6)
    for i in range(4):
        p.pose(24.45 + i * .16, clic(1250 + i * 130, .06, .45), .28, -.3 + i * .2)
        p.pose(24.45 + i * .16, scintillement(.9, 9, 1700), .16, -.3 + i * .2)
    p.pose(25.40, montee(1.0), .20)

    # 11 · la signature
    p.pose(27.00, montee(1.7), .40)
    p.pose(28.00, souffle(.9, False, 1.0), .6)
    p.pose(28.75, choc(58, 2.2), .60)
    p.pose(28.85, carillon(587, (1, 1.5, 2, 3), 2.2, (1, .45, .3, .12)), .30)


def film2(p):
    """« La carte de fidélité » — voir ../fidelite/fidelite.js"""
    p.pose(0, nappe(32.5), .9)

    # 1 · la carte
    p.pose(0.10, souffle(.8, True, .9), .75)
    p.pose(1.30, clic(1500, .05, .4), .22)
    p.pose(1.55, montee(.9), .16)

    # 2 · la caisse, le scan
    p.pose(3.00, souffle(.85, True, 1.0), .9, .4)
    p.pose(4.40, clic(950, .07, .8), .55, .3)
    p.pose(4.70, souffle(.5, True, .55), .34, 0)
    p.pose(5.55, blip(1320, .12, .06), .46, -.25)   # la carte est lue
    p.pose(5.55, carillon(1046, duree=.5), .20, -.25)

    # 3 · la fiche, la récompense
    p.pose(6.10, carillon(880, (1, 2, 3.02), .8, (1, .4, .2)), .24, .2)
    p.pose(6.50, clic(1400, .05, .35), .18, .3)

    # 4 · le montant, touche par touche
    for i in range(4):
        p.pose(7.40 + i * .42, touche(i), .50, .35)
    p.pose(9.40, clic(1050, .06, .6), .34, .2)
    p.pose(9.90, clic(1300, .05, .4), .20, .1)

    # 5 · on encaisse, les points volent
    p.pose(11.00, clic(820, .08, .9), .60, .15)
    p.pose(11.35, souffle(.62, True, .7), .42, .1)
    p.pose(12.20, blip(1250, .12, .06), .46, -.35)
    p.pose(12.20, scintillement(.95, 13, 1400), .40, -.35)
    p.pose(12.60, notification(), .34, .45)

    # 6 · ce que ça débloque
    p.pose(13.40, carillon(1174, duree=.8), .26, -.35)
    for i in range(3):
        p.pose(13.80 + i * .22, blip(900 + i * 120, .11, .05), .30, -.35)

    # 7 · l'anniversaire
    p.pose(16.20, souffle(.75, True, .85), .7)
    for i in range(3):
        p.pose(16.80 + i * .2, clic(1350 + i * 110, .06, .45), .26, -.25 + i * .25)
    p.pose(18.40, clic(880, .07, .8), .48)
    p.pose(18.66, reussite(), .38)

    # 8 · le tableau de bord
    p.pose(20.40, souffle(.8, True, .9), .7)
    for i in range(4):
        p.pose(20.90 + i * .16, clic(1250 + i * 130, .06, .45), .28, -.3 + i * .2)
        p.pose(20.90 + i * .16, scintillement(.95, 10, 1650), .16, -.3 + i * .2)
    p.pose(21.90, clic(1500, .05, .4), .20)
    p.pose(22.30, montee(1.1), .22)
    p.pose(22.90, clic(1400, .05, .4), .18)

    # 9 · la signature
    p.pose(25.20, montee(1.7), .40)
    p.pose(26.20, souffle(.9, False, 1.0), .6)
    p.pose(26.95, choc(58, 2.2), .60)
    p.pose(27.05, carillon(523, (1, 1.5, 2, 3), 2.3, (1, .45, .3, .12)), .30)


if __name__ == '__main__':
    quel, sortie = sys.argv[1], sys.argv[2]
    duree = 33.0 if quel == 'film1' else 32.5
    p = Piste(duree)
    (film1 if quel == 'film1' else film2)(p)
    rendre(p, sortie)

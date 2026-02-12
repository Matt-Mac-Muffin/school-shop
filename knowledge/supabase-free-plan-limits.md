# Limites du plan gratuit Supabase

## Pause automatique

Les projets Supabase en plan gratuit sont **mis en pause après 7 jours sans requête à la base de données**. Un email d'avertissement est envoyé avant la pause.

Conséquences d'une pause :
- La DB PostgreSQL est éteinte.
- Toutes les API Supabase (REST, Auth, Storage) ne répondent plus.
- Les Netlify Functions qui appellent Supabase échouent.
- Le front Angular affiche une page "Service temporairement indisponible".

Réactivation : depuis le dashboard Supabase, bouton "Restore project". Prend quelques minutes, les données sont conservées.

## Quotas Storage

- **Free** : 1 Go de stockage, 2 Go d'egress.
- **Pro** (25$/mois) : 100 Go, dépassement à ~0,02$/Go/mois.

Pour un site d'école avec des images produits de 2 Mo max, le plan gratuit suffit largement (1 Go = ~500 images).

## Contournement de la pause : cron job via Netlify

Netlify propose des **Scheduled Functions** (cron) disponibles dans le plan gratuit. On peut créer une fonction qui appelle `/api/get-products` régulièrement (ex: tous les 3 jours) pour empêcher la pause Supabase, sans ajouter de service externe.

Non implémenté pour l'instant — option à activer si la pause devient un problème en POC.

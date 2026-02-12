# Prochaines etapes

## 1. Tester le flux complet en local

1. Aller sur `http://localhost:8888/admin/login` et se connecter avec le compte admin
2. Creer un produit (nom, prix, image, actif)
3. Aller sur `http://localhost:8888` (page publique)
4. Cliquer "Commander" sur un produit, remplir le formulaire
5. Payer avec la carte de test : `4242 4242 4242 4242` (date future, CVC quelconque)
6. Verifier la redirection vers `/success`
7. Verifier la commande dans le dashboard admin (onglet Commandes)

## 2. Deployer sur Netlify

1. Connecter le repo Git a Netlify (New site > Import from Git)
2. Ajouter toutes les variables d'environnement dans **Site settings > Environment variables**
3. Mettre `SITE_URL` a l'URL de production (ex: `https://mon-site.netlify.app`)
4. Netlify build et deploie automatiquement

## 3. Configurer le webhook Stripe en production

1. Aller dans **Stripe > Developers > Webhooks**
2. Ajouter un endpoint : `https://mon-site.netlify.app/api/stripe-webhook`
3. Selectionner l'evenement `checkout.session.completed`
4. Copier le **Signing secret** (`whsec_...`) dans les variables d'environnement Netlify comme `STRIPE_WEBHOOK_SECRET`

## 4. Mettre a jour l'environnement de production

Mettre a jour `src/environments/environment.prod.ts` avec les cles de production (ou les cles test si on reste en mode test Stripe).
